'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { supabase } from '@/lib/supabase';
import { useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';
import { setError, signOut } from '@/redux/features/auth';

export default function SignOut() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { session } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin'); // Changed from "/" to "/auth/signin"
    }
  }, [session, router]);

  const handleSignOut = async () => {
    try {
      dispatch(signOut());
      toast.success('Successfully signed out');
      router.push('/auth/signin'); // Changed from "/" to "/auth/signin"
    } catch (err: any) {
      dispatch(setError(err.message || 'Failed to sign out'));
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
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Out
            </button>
          </>
        )}
        {!session && <p className="text-gray-600">You are already signed out. Redirecting...</p>}
      </div>
    </div>
  );
}
