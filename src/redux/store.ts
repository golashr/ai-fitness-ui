import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './features/auth';
import sessionReducer from './features/sessionSlice';

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
