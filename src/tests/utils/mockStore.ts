import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from '@/redux/auth-session';
import type { RootState } from '@/redux/store';
import sessionReducer from '@/redux/auth-session/sessionSlice';

export const createTestStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      auth: authReducer as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session: sessionReducer as any,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

export type TestStore = ReturnType<typeof createTestStore>;
