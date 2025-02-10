'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

export default function Settings() {
  return (
    <Suspense>
      <ProtectedRoute>
        <div className="min-h-screen bg-white p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">AI Fitness Settings</h1>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
