'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export default function Fitness() {
  return (
    <Suspense>
      <ProtectedRoute>
        <div className="p-8 text-gray-900 bg-white">
          <h1 className="text-2xl font-bold mb-4">Fitness Dashboard</h1>
          <p className="mb-8">
            Welcome to your personalized fitness tracking and planning dashboard.
          </p>
          {/* Add fitness content here */}
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
