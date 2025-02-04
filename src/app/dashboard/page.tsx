'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const { session, isLoading, userDetails } = useAppSelector((state) => state.session);

  console.log('Dashboard render - Loading:', isLoading, 'Session:', !!session); // Debug render

  useEffect(() => {
    console.log('Dashboard mount - Session:', !!session, 'Loading:', isLoading);

    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.log('Still loading after 5 seconds');
      }
    }, 5000);

    if (!isLoading && !session) {
      console.log('No session found, redirecting');
      toast.success('Please sign in to access the dashboard');
      router.push('/auth/signin');
    }

    return () => clearTimeout(timeoutId);
  }, [session, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4 text-white">AI Fitness Dashboard</h1>
      <p className="text-gray-300">Welcome {userDetails?.name || userDetails?.email}</p>
    </div>
  );
}
