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
