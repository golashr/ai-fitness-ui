'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setupTOTP, verifyTOTP } from '@/redux/auth-session/thunks';
import toast from 'react-hot-toast';
import { AuthError } from '@supabase/supabase-js';
import ResetPasswordSection from './components/ResetPasswordSection';
import Image from 'next/image';

export default function Security() {
  const dispatch = useAppDispatch();
  const { isLoading, totpSecret, totpQR, isMFAEnabled } = useAppSelector((state) => state.auth);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSetupMFA = async () => {
    try {
      await dispatch(setupTOTP()).unwrap();
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Failed to setup MFA');
      }
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(verifyTOTP({ code: verificationCode })).unwrap();
      toast.success('MFA setup successful!');
      setVerificationCode('');
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Invalid verification code');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Settings</h1>
        <div className="space-y-6">
          {/* 2FA Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Two-Factor Authentication (2FA)
            </h2>

            {!isMFAEnabled && !totpQR && (
              <div className="mb-6">
                <p className="text-gray-600 mb-4">
                  Enhance your account security by enabling two-factor authentication.
                </p>
                <button
                  onClick={handleSetupMFA}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? 'Setting up...' : 'Setup 2FA'}
                </button>
              </div>
            )}

            {totpQR && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">1. Scan QR Code</h3>
                  <p className="text-gray-600 mb-4">
                    Scan this QR code with your authenticator app (like Google Authenticator or
                    Authy).
                  </p>
                  <div className="w-64 h-64 mx-auto relative">
                    <Image
                      src={totpQR}
                      alt="QR Code"
                      fill
                      sizes="(max-width: 768px) 256px, 256px"
                      className="object-contain"
                      unoptimized
                      priority
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    2. Enter Verification Code
                  </h3>
                  <form onSubmit={handleVerifyMFA} className="space-y-4">
                    <div>
                      <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="code"
                        value={verificationCode}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setVerificationCode(e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                  </form>
                </div>

                {totpSecret && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Backup Code</h3>
                    <p className="text-gray-600 mb-2">
                      Save this secret code in a secure place as backup:
                    </p>
                    <code className="text-gray-600 px-2 py-1 rounded">{totpSecret}</code>
                  </div>
                )}
              </div>
            )}

            {isMFAEnabled && (
              <div className="text-green-600 font-medium">
                ✓ Two-factor authentication is enabled
              </div>
            )}
          </div>

          <ResetPasswordSection />
        </div>
      </div>
    </div>
  );
}
