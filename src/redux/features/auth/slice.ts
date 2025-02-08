import { createSlice } from '@reduxjs/toolkit';
import { AuthState } from './types';
import {
  signInWithPassword,
  signOut,
  resetPassword,
  resendVerificationEmail,
  signUpWithPassword,
  requestForgotPassword,
} from './thunks';

export const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isSignedUp: false,
  requiresEmailVerification: false,
  mfaRequired: false,
  email: null,
  totpSecret: undefined,
  totpQR: undefined,
  isMFAEnabled: false,
  resetPasswordSuccess: false,
  isSessionCleared: true,
  isInPasswordResetFlow: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.requiresEmailVerification = false;
        state.email = null;
      })
      .addCase(signUpWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSignedUp = true;
        state.requiresEmailVerification = true;
        state.email = action.payload.email!;
        state.user = null;
        state.error = null;
      })
      .addCase(signUpWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.requiresEmailVerification = false;
        state.email = null;
      })
      .addCase(signInWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSignedUp = true;
        state.user = action.payload.user
          ? {
              id: action.payload.user.id,
              name: action.payload.user.user_metadata.name,
              email: action.payload.user.email!,
            }
          : null;
        state.requiresEmailVerification = false;
        state.isSessionCleared = false;
        state.error = null;
      })
      .addCase(signInWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.email = null;
        state.error = action.payload as string;
      })
      .addCase(signOut.fulfilled, () => {
        return initialState;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.isInPasswordResetFlow = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resendVerificationEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(requestForgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isInPasswordResetFlow = true;
      })
      .addCase(requestForgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.isInPasswordResetFlow = true;
      })
      .addCase(requestForgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to send reset instructions';
        state.isInPasswordResetFlow = true;
      });
  },
});

export const { setError, clearError } = authSlice.actions;
export default authSlice.reducer;
