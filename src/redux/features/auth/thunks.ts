import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import type { SignInCredentials, OTPVerificationData } from './types';
import type { Session, User } from '@supabase/supabase-js';
import { AuthError } from '@supabase/supabase-js';
import { clearSession, setSession } from '../sessionSlice';
import { initialState } from './slice';

interface ThunkConfig {
  rejectValue: string;
}

interface AuthResponse {
  user: User | null;
  session: Session | null;
}

interface TOTPVerifyResponse {
  code: string;
}

interface ResetPasswordResponse {
  success: boolean;
}

export const signUpWithPassword = createAsyncThunk<
  { email: string | undefined; requiresEmailVerification: boolean },
  SignInCredentials,
  ThunkConfig
>('auth/registerUser', async ({ email, password, name }, { dispatch, rejectWithValue }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/signin`,
      },
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    if (!data.user) {
      console.error('Sign up failed: No user data returned');
      throw new Error('Sign up failed');
    }

    if (data.user.identities?.length === 0) {
      throw new Error('Email already signed up');
    }

    // Clear any session that might have been created
    await supabase.auth.signOut();
    dispatch(clearSession());

    return {
      ...initialState,
      email: data.user.email,
      requiresEmailVerification: true,
    };
  } catch (error) {
    console.error('Signup error:', error);
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to sign up with password');
  }
});

export const signInWithPassword = createAsyncThunk<
  AuthResponse,
  Omit<SignInCredentials, 'name'>,
  ThunkConfig
>('auth/signInWithPassword', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) throw signInError;
    if (!authData.user) throw new Error('Sign in failed: No user data');

    // 2. Check if user is verified
    if (!authData.user.confirmed_at) {
      throw new Error('Please verify your email before signing in');
    }

    // 3. Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    // 4. Create profile if it doesn't exist
    if (!profile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            name: authData.user.user_metadata.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      return {
        user: authData.user,
        session: authData.session,
      };
    }

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    dispatch(setSession(authData.session));

    return {
      user: authData.user,
      session: authData.session,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to sign in with password');
  }
});

export const signOut = createAsyncThunk<boolean, void, ThunkConfig>(
  'auth/signOut',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch(clearSession());
      return true;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to sign out');
    }
  }
);

export const requestPasswordReset = createAsyncThunk<ResetPasswordResponse, string, ThunkConfig>(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to send reset instructions');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to reset password');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, token }: OTPVerificationData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (error) throw error;
      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to verfy OTP');
    }
  }
);

export const setupTOTP = createAsyncThunk<{ secret: string; qr: string }, void, ThunkConfig>(
  'auth/setupTOTP',
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });
      if (error) throw error;
      if (!data.id) throw new Error('Failed to setup TOTP');

      return {
        secret: data.totp.secret,
        qr: data.totp.qr_code,
      };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to setup TOTP');
    }
  }
);

export const verifyTOTP = createAsyncThunk<{ success: boolean }, TOTPVerifyResponse, ThunkConfig>(
  'auth/verifyTOTP',
  async ({ code }, { rejectWithValue }) => {
    try {
      // First create a challenge
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: 'totp',
      });

      if (challengeError) throw challengeError;

      // Then verify with the challenge
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: 'totp',
        challengeId: challengeData.id,
        code,
      });

      if (error) throw error;
      if (!data) throw new Error('Verification failed');

      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to verify TOTP');
    }
  }
);

export const resendVerificationEmail = createAsyncThunk<{ success: boolean }, string, ThunkConfig>(
  'auth/resendVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to resend verification email');
    }
  }
);
