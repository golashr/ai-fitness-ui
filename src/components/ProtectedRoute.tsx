'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session, isLoading } = useAppSelector((state) => state.session);

  useEffect(() => {
    // Handle password reset flow
    const token = searchParams?.get('token');
    const type = searchParams?.get('type');

    if (token && type === 'recovery') {
      router.replace(`/auth/reset-password?token=${token}`);
      return;
    }

    // Only redirect if we're not loading and there's no session
    if (!isLoading && !session) {
      router.replace('/auth/signin');
    }
  }, [router, searchParams, session, isLoading]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  // Don't render children if no session
  if (!session) {
    return null;
  }

  return <>{children}</>;
}
