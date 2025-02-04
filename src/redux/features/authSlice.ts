import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';

// Add types for user data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isRegistered: boolean;
  mfaRequired: boolean;
  email: string | null;  // Store email for OTP verification
  totpSecret?: string;
  totpQR?: string;
  isMFAEnabled: boolean;
  resetPasswordSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isRegistered: false,
  mfaRequired: false,
  email: null,
  totpSecret: undefined,
  totpQR: undefined,
  isMFAEnabled: false,
  resetPasswordSuccess: false,
};

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (!data.user) {
        console.error('Registration failed: No user data returned');
        throw new Error('Registration failed');
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (profileError) {
        console.log('Profile creation error:', {
          error: profileError,
          userId: data.user.id,
          email
        });
        throw profileError;
      }

      console.log('Registration successful:', { userId: data.user.id, email });

      return {
        user: {
          id: data.user.id,
          name,
          email,
          created_at: profile?.created_at,
          updated_at: profile?.updated_at,
        }
      };
    } catch (error: any) {
      console.log('Registration error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return rejectWithValue(error.message);
    }
  }
);

export const signUpWithPassword = createAsyncThunk(
  'auth/signUpWithPassword',
  async ({ email, password, name }: { email: string; password: string; name: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/signin`, // Redirect to signin after verification
        }
      });

      if (error) throw error;

      return {
        message: 'Please check your email for verification link',
        email: data.user?.email
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signInWithPassword = createAsyncThunk(
  'auth/signInWithPassword',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If email not confirmed, show specific message
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email before signing in');
        }
        throw error;
      }

      return {
        user: data.user,
        session: data.session,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ email, token }: { email: string; token: string }, { rejectWithValue }) => {
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

export const setupTOTP = createAsyncThunk(
  'auth/setupTOTP',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Starting TOTP enrollment...');
      
      const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'AI Fitness',
        friendlyName: 'AI Fitness Auth'
      });

      if (enrollError) throw enrollError;
      
      console.log('TOTP enrollment response:', enrollData);

      if (!enrollData?.totp) {
        throw new Error('TOTP setup failed - no TOTP data received');
      }

      console.log('TOTP enrollment successful:', {
        factorId: enrollData.id,
        hasSecret: !!enrollData.totp.secret,
        hasQR: !!enrollData.totp.qr_code
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
  }
);

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
        factorId: totpFactor.id
      });

      if (challengeError) throw challengeError;

      // Verify the factor with challenge
      const { data: verifyData, error } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challengeData.id,
        code
      });

      if (error) throw error;

      return verifyData;
    } catch (error: any) {
      console.error('TOTP verification error:', error);
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
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      return { message: 'Password updated successfully' };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearAuthState: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetMFA: (state) => {
      state.mfaRequired = false;
      state.email = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        console.log('Registration rejected:', action.payload);
      })
      .addCase(signUpWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isRegistered = true;
        state.user = null;
        state.error = null;
        state.email = action.payload.email!;
      })
      .addCase(signUpWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signInWithPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.mfaRequired = true;  // Always set to true after password auth
        state.email = action.payload.user.email!;
      })
      .addCase(signInWithPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.mfaRequired = false;  // Reset after successful OTP verification
        state.email = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(setupTOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.totpSecret = action.payload.totpSecret;
        state.totpQR = action.payload.totpQR;
      })
      .addCase(verifyTOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.isMFAEnabled = true;
        state.totpSecret = undefined;
        state.totpQR = undefined;
      })
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.resetPasswordSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.user = null;
        // Reset any other auth-related state here
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLoading, setError, clearAuthState, clearError, resetMFA } = authSlice.actions;
export default authSlice.reducer; 