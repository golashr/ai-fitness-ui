import { configureStore } from '@reduxjs/toolkit';
import { authReducer, sessionReducer } from './auth-session';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable for development if needed
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
