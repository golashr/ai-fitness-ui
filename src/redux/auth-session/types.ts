import { Session, User } from '@supabase/supabase-js';

export const initialAuthState: AuthState = {
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

export interface SessionState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  userDetails: {
    avatar_url?: string;
    email?: string;
    name?: string;
    language?: string;
    phone?: string;
  } | null;
}

export const initialSessionState: SessionState = {
  user: null,
  session: null,
  isLoading: false,
  userDetails: null,
};

// Add types for user data
interface UserProfile {
  id: string;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSignedUp: boolean;
  requiresEmailVerification: boolean;
  mfaRequired: boolean;
  email: string | null; // Store email for OTP verification
  totpSecret?: string;
  totpQR?: string;
  isMFAEnabled: boolean;
  resetPasswordSuccess: boolean;
  isSessionCleared: boolean;
  isInPasswordResetFlow: boolean;
}

export interface SignInCredentials {
  email: string;
  password: string;
  name: string;
}

export interface OTPVerificationData {
  email: string;
  token: string;
}

export interface ThunkConfig {
  rejectValue: string;
}

export interface AuthResponse {
  user: User | null;
  session: Session | null;
}

export interface TOTPVerifyResponse {
  code: string;
}

export interface RequestPasswordResponse {
  success: boolean;
}

export interface ResetPasswordResponse {
  message: string;
}
