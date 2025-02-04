export interface AuthState {
  user: any | null;
  isLoading: boolean;
  error: string | null;
  mfaRequired: boolean;
  totpSecret?: string;
  totpQR?: string;
  factorId?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface OTPVerificationData {
  email: string;
  token: string;
}
