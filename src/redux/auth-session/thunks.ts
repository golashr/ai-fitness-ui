import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { AuthError } from '@supabase/supabase-js';
import type { SignInCredentials, OTPVerificationData, RequestPasswordResponse } from './types';
import { clearSession, setSession } from './sessionSlice';
import { ThunkConfig, AuthResponse, ResetPasswordResponse, TOTPVerifyResponse } from './types';
import { setLoading } from '@/redux/auth-session/sessionSlice';

export const signUpWithPassword = createAsyncThunk<
  { email: string | undefined; requiresEmailVerification: boolean },
  SignInCredentials,
  ThunkConfig
>('auth/registerUser', async ({ email, password, name }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign up failed');
    if (data.user.identities?.length === 0) {
      throw new Error('Email already signed up');
    }

    // Clear any session that might have been created
    await supabase.auth.signOut();
    dispatch(clearSession());

    return {
      // ...initialState,
      email: data.user.email,
      requiresEmailVerification: true,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to sign up');
  } finally {
    dispatch(setLoading(false));
  }
});

export const signInWithPassword = createAsyncThunk<
  AuthResponse,
  Omit<SignInCredentials, 'name'>,
  ThunkConfig
>('auth/signInWithPassword', async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');
    if (!data.user.confirmed_at) {
      throw new Error('Please verify your email before signing in');
    }

    // 3. Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // 4. Create profile if it doesn't exist
    if (!profile) {
      const { error: createError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.name,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      return {
        user: data.user,
        session: data.session,
      };
    }

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    dispatch(setSession(data.session));

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to sign in');
  } finally {
    dispatch(setLoading(false));
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

export const requestForgotPassword = createAsyncThunk<RequestPasswordResponse, string, ThunkConfig>(
  'auth/requestForgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
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

export const resetPassword = createAsyncThunk<ResetPasswordResponse, string, ThunkConfig>(
  'auth/resetPassword',
  async (password: string, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true));
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      return { message: 'Password updated successfully' };
    } catch (error) {
      if (error instanceof AuthError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Failed to reset password');
    } finally {
      dispatch(setLoading(false));
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

export const updateProfile = createAsyncThunk<
  { success: boolean },
  { language?: string; phone?: string; firstName: string; lastName: string },
  ThunkConfig
>('auth/updateProfile', async (profileData, { dispatch, rejectWithValue }) => {
  try {
    dispatch(setLoading(true));
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new Error('User not found');

    // Update auth metadata with timeout
    const updatePromise = supabase.auth.updateUser({
      data: {
        name: `${profileData.firstName} ${profileData.lastName}`,
        language: profileData.language || 'en',
        phone: profileData.phone || '',
      },
    });

    // Add a timeout of 5 seconds
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Update timeout')), 5000);
    });

    const response: Awaited<ReturnType<typeof supabase.auth.updateUser>> = await Promise.race([
      updatePromise,
      timeoutPromise,
    ]);

    if (response?.error) throw response?.error;

    // Update profile table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: `${profileData.firstName} ${profileData.lastName}`,
        language: profileData.language || 'en',
        phone: profileData.phone || '',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) throw profileError;

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to update profile');
  } finally {
    dispatch(setLoading(false));
  }
});
