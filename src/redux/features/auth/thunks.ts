import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { SignInCredentials, OTPVerificationData } from './types';

export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async (credentials: SignInCredentials, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(credentials);
      if (error) throw error;
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk('auth/signOut', async (_, { rejectWithValue }) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Add other thunks (verifyOTP, setupTOTP, etc.)
