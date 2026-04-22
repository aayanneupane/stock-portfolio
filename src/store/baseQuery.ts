import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import { logout, updateTokens } from './auth/authSlice';
import type { RootState } from './store';

const baseUrl =
  (import.meta as ImportMeta & { env: Record<string, string> }).env
    .VITE_API_BASE_URL ?? 'http://localhost:4000';

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

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

const flushQueue = () => {
  pendingQueue.forEach((resolve) => resolve());
  pendingQueue = [];
};

export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const is401 = result.error?.status === 401;
  const isExpired =
    is401 &&
    (result.error?.data as { message?: string } | undefined)?.message ===
      'Access token expired';

  if (!isExpired) return result;

  if (isRefreshing) {
    await new Promise<void>((resolve) => pendingQueue.push(resolve));
    return rawBaseQuery(args, api, extraOptions);
  }

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
    pendingQueue = [];
    api.dispatch(logout());
  }

  return result;
};

export default baseQuery;
