'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export default function ReferAndEarn() {
  return (
    <Suspense>
      <ProtectedRoute>
        <div className="p-8 text-gray-900 bg-white">
          <h1 className="text-2xl font-bold mb-4">Refer & Earn</h1>
          <p className="mb-8">Share AI Fitness with your friends and earn rewards.</p>
          {/* Add referral content here */}
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
