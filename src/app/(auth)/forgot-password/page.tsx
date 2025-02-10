'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { requestForgotPassword, clearError } from '@/redux/auth-session';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const { session } = useAppSelector((state) => state.session);

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  // Clear any existing errors when component mounts
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [dispatch, error]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(requestForgotPassword(email)).unwrap();
      toast.success(
        'If an account exists with this email, you will receive password reset instructions.',
        { duration: 5000 }
      );
      router.replace('/signin');
    } catch (error) {
      if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Failed to send reset instructions');
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-24">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Reset your password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-gray-900 p-2 text-gray-900"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </div>
          <div className="text-center">
            <Link href="/signin" className="text-sm text-blue-600 hover:text-blue-500">
              Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
