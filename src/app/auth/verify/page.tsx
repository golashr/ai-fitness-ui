'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';

export default function VerifyEmail() {
  const router = useRouter();
  const { session } = useAppSelector((state) => state.session);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Short delay to allow session to be checked
    const timer = setTimeout(() => {
      if (session) {
        toast.success('Email verified successfully');
        router.replace('/dashboard');
      } else {
        router.replace('/auth/signin');
      }
      setIsChecking(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [session, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white shadow rounded-lg">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Checking verification status</h2>
            <p className="mt-2 text-sm text-gray-600">Please wait a moment...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
