'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setupTOTP, verifyTOTP } from '@/redux/features/authSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';
import ResetPasswordSection from './components/ResetPasswordSection';

export default function Settings() {
  const dispatch = useAppDispatch();
  const { isLoading, totpSecret, totpQR, isMFAEnabled } = useAppSelector((state) => state.auth);
  const [verificationCode, setVerificationCode] = useState('');

  const handleSetupMFA = async () => {
    try {
      await dispatch(setupTOTP()).unwrap();
      toast.success('Scan the QR code with your authenticator app');
    } catch (err: any) {
      toast.error(err.message || 'Failed to setup MFA');
    }
  };

  const handleVerifyMFA = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(verifyTOTP({ code: verificationCode })).unwrap();
      toast.success('MFA setup successful!');
    } catch (err: any) {
      console.log(`handleVerifyMFA error: ${err}`);
      toast.error(err.message || 'Invalid verification code');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Security Settings</h1>

        <div className="bg-white shadow rounded-lg p-6">
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
                  Scan this QR code with your authenticator app (e.g., Google Authenticator)
                </p>
                <div className="bg-gray-100 p-4 rounded-lg inline-block">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: decodeURIComponent(totpQR.replace('data:image/svg+xml;utf-8,', '')),
                    }}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  2. Enter Verification Code
                </h3>
                <form onSubmit={handleVerifyMFA} className="space-y-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3 py-2 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Enable 2FA'}
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
            <div className="text-green-600 font-medium">✓ Two-factor authentication is enabled</div>
          )}
        </div>
        <ResetPasswordSection />
      </div>
    </div>
  );
}
