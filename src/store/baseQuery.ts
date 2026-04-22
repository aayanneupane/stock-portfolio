import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { logout, updateTokens } from './auth/authSlice';
import type { RootState } from './store';

// ─── Base URL ─────────────────────────────────────────────────────────────────

const baseUrl =
  (import.meta as ImportMeta & { env: Record<string, string> }).env
    .VITE_API_BASE_URL ?? 'http://localhost:4000';

// ─── Raw fetchBaseQuery with header injection ─────────────────────────────────

/**
 * Inner query that injects the current access token from Redux state into
 * every outgoing request as an Authorization: Bearer header.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ─── Mutex to prevent concurrent refresh storms ───────────────────────────────

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

const flushQueue = () => {
  pendingQueue.forEach((resolve) => resolve());
  pendingQueue = [];
};

// ─── Exported baseQuery with 401 interceptor ──────────────────────────────────

/**
 * Production-ready RTK Query base query that:
 *  1. Injects Bearer token on every request.
 *  2. Detects 401 "Access token expired" responses.
 *  3. Calls /api/auth/refresh-token with the stored refreshToken.
 *  4. On success → dispatches updateTokens, re-fires the original request.
 *  5. On failure / missing refreshToken → dispatches logout().
 *  6. Uses a mutex so parallel 401s trigger only one refresh call.
 */
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // ── 1. Fire the original request ──────────────────────────────────────────
  let result = await rawBaseQuery(args, api, extraOptions);

  // ── 2. Check whether the server signalled an expired access token ─────────
  const is401 = result.error?.status === 401;
  const isExpired =
    is401 &&
    (result.error?.data as { message?: string } | undefined)?.message ===
      'Access token expired';

  if (!isExpired) return result;

  // ── 3. If a refresh is already in flight, wait for it then retry ──────────
  if (isRefreshing) {
    await new Promise<void>((resolve) => pendingQueue.push(resolve));
    return rawBaseQuery(args, api, extraOptions);
  }

  // ── 4. Attempt the token refresh ──────────────────────────────────────────
  const { refreshToken } = (api.getState() as RootState).auth;

  if (!refreshToken) {
    api.dispatch(logout());
    return result;
  }

  isRefreshing = true;

  const refreshResult = await rawBaseQuery(
    {
      url: '/api/auth/refresh-token',
      method: 'POST',
      body: { refreshToken },
    },
    api,
    extraOptions
  );

  isRefreshing = false;

  if (refreshResult.data) {
    // ── 5a. Refresh succeeded → update store, unblock queue, retry ──────────
    const payload =
      (refreshResult.data as { data?: unknown }).data ?? refreshResult.data;
    const { accessToken, refreshToken: newRefresh, user } = payload as {
      accessToken: string;
      refreshToken: string;
      user: import('./auth/authSlice').AuthUser;
    };

    api.dispatch(updateTokens({ accessToken, refreshToken: newRefresh, user }));
    flushQueue();

    result = await rawBaseQuery(args, api, extraOptions);
  } else {
    // ── 5b. Refresh failed → drop queue and force logout ────────────────────
    pendingQueue = [];
    api.dispatch(logout());
  }

  return result;
};

export default baseQuery;
