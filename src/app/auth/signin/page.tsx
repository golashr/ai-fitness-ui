'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { signInWithPassword, verifyOTP, setError } from '@/redux/features/authSlice';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error, mfaRequired } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otpCode, setOtpCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(signInWithPassword(formData)).unwrap();
      router.push('/dashboard');
    } catch (err: any) {
      if (err.includes('Email not confirmed')) {
        toast.error(
          'Please verify your email before signing in. Check your inbox for the verification link.'
        );
      } else {
        toast.error(err || 'Failed to sign in');
      }
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(verifyOTP({ email: formData.email, token: otpCode })).unwrap();
      toast.success('Successfully signed in!');
      router.push('/dashboard');
    } catch (err: any) {
      console.log(`handleOTPSubmit error: ${err}`);
      toast.error(err.message || 'Invalid verification code');
      dispatch(setError(err.message));
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Failed to sign in with Google');
      dispatch(setError(err.message));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 mx-auto rounded-full bg-blue-400"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-gray-700 mb-6">Sign In to AI Fitness</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot your password?
          </Link>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-900"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-900 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={handleGoogleSignIn}
        >
          <Image src="/google-icon.svg" alt="Google" width={20} height={20} className="w-5 h-5" />
          Sign in with Google
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
