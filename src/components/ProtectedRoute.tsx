'use client';

import { useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/about',
  '/terms',
  '/privacy',
  '/auth/signin',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/verify',
  '/auth/reset-password',
];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
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

    // If it's a public route, don't enforce authentication
    if (PUBLIC_ROUTES.includes(pathname || '')) {
      return;
    }

    // For protected routes, redirect to signin if no session
    if (!isLoading && !session) {
      router.replace('/auth/signin');
    }
  }, [session, isLoading, router, pathname, searchParams]);

  // Don't show loading state for public routes
  if (!PUBLIC_ROUTES.includes(pathname || '') && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
