import { configureStore } from '@reduxjs/toolkit';
import portfolioReducer from './portfolio/portfolioSlice';

export const createAppStore = () =>
  configureStore({
    reducer: {
      portfolio: portfolioReducer,
    },
    devTools: import.meta.env.MODE !== 'production',
  });

export const store = createAppStore();

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;