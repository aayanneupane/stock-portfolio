import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { baseApi } from './baseApi.config';

export const store = configureStore({
  reducer: {
    // Feature reducers
    auth: authReducer,

    // RTK Query cache reducer (keyed by reducerPath = 'api')
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // RTK Query middleware: enables caching, invalidation, polling, etc.
      .concat(baseApi.middleware),

  // Vite-safe DevTools: enabled in dev, disabled in production bundle
  devTools: import.meta.env.MODE !== 'production',
});

// Infer the RootState type from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Infer the AppDispatch type so thunks are fully typed
export type AppDispatch = typeof store.dispatch;