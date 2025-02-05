import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import { SignInCredentials, OTPVerificationData } from './types';
import { setSession, clearSession } from '../sessionSlice';
import { initialState } from './slice';

export const signUpWithPassword = createAsyncThunk(
  'auth/signUpUser',
  async ({ email, password, name }: SignInCredentials, { dispatch, rejectWithValue }) => {
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
    } catch (error: any) {
      console.error('Signup error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async ({ email, password }: Omit<SignInCredentials, 'name'>, { dispatch, rejectWithValue }) => {
    try {
      // 1. Sign in the user
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
        const { data: newProfile, error: createError } = await supabase
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
    } catch (error: any) {
      console.error('Sign in error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear session state
      dispatch(clearSession());
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return { message: 'Password reset instructions sent to your email' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (password: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });
      if (error) throw error;
      return { message: 'Password updated successfully' };
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const setupTOTP = createAsyncThunk('auth/setupTOTP', async (_, { rejectWithValue }) => {
  try {
    console.log('Starting TOTP enrollment...');

    const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      issuer: 'AI Fitness',
      friendlyName: 'AI Fitness Auth',
    });

    if (enrollError) throw enrollError;

    console.log('TOTP enrollment response:', enrollData);

    if (!enrollData?.totp) {
      throw new Error('TOTP setup failed - no TOTP data received');
    }

    console.log('TOTP enrollment successful:', {
      factorId: enrollData.id,
      hasSecret: !!enrollData.totp.secret,
      hasQR: !!enrollData.totp.qr_code,
    });

    return {
      factorId: enrollData.id,
      totpSecret: enrollData.totp.secret,
      totpQR: enrollData.totp.qr_code,
    };
  } catch (error: any) {
    console.error('TOTP setup error:', error);
    return rejectWithValue(error.message);
  }
});

export const verifyTOTP = createAsyncThunk(
  'auth/verifyTOTP',
  async ({ code }: { code: string }, { rejectWithValue }) => {
    try {
      // Get the current factors
      const { data, error: listError } = await supabase.auth.mfa.listFactors();

      if (listError) throw listError;

      console.log('MFA data received:', JSON.stringify(data, null, 2));

      // Check if we have any TOTP factors
      if (!data?.totp || data.totp.length === 0) {
        throw new Error('No TOTP factors found. Please try setting up MFA again.');
      }

      // Get the first TOTP factor
      const totpFactor = data.totp[0];

      if (!totpFactor?.id) {
        throw new Error('TOTP factor not found. Please try setting up MFA again.');
      }

      console.log('Found TOTP factor:', totpFactor);
      // Get challenge for the factor
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId: totpFactor.id,
      });

      if (challengeError) throw challengeError;

      // Verify the factor with challenge
      const { data: verifyData, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code,
      });

      if (error) throw error;

      return verifyData;
    } catch (error: any) {
      console.error('TOTP verification error:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerification',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`,
        },
      });

      if (error) throw error;

      return { message: 'Verification email resent successfully' };
    } catch (error: any) {
      console.error('Resend verification error:', error);
      return rejectWithValue(error.message);
    }
  }
);
