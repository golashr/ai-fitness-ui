'use client';

import { useAppSelector } from '@/redux/hooks';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export default function Dashboard() {
  const { userDetails } = useAppSelector((state) => state.session);

  return (
    <Suspense>
      <ProtectedRoute>
        <div className="min-h-screen bg-white p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">AI Fitness Dashboard</h1>
          <p className="text-gray-900">Welcome {userDetails?.name || userDetails?.email}</p>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
