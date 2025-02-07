import ProtectedRoute from '@/components/ProtectedRoute';
import LandingContent from '@/components/LandingContent';
import { Suspense } from 'react';

export default function Home() {
  return (
    <Suspense>
      <ProtectedRoute>
        <LandingContent />
      </ProtectedRoute>
    </Suspense>
  );
}
