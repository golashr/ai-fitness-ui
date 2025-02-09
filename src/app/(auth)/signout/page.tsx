'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';
import { signOut } from '@/redux/features/auth';
import { AuthError } from '@supabase/supabase-js';

export default function SignOut() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { session } = useAppSelector((state) => state.session);
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!session) {
      router.replace('/signin');
    }
  }, [session, router]);

  const handleSignOut = async () => {
    try {
      await dispatch(signOut()).unwrap();
      toast.success('Successfully signed out');
      router.replace('/signin');
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else if (typeof error === 'string') {
        toast.error(error);
      } else {
        toast.error('Failed to sign out');
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Sign Out</h2>
        {session && (
          <>
            <p className="text-gray-600 mb-6">Are you sure you want to sign out?</p>
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
          </>
        )}
        {!session && <p className="text-gray-600">You are already signed out. Redirecting...</p>}
      </div>
    </div>
  );
}
