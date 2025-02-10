'use client';

import { Suspense } from 'react';
import ProfileForm from './components/ProfileForm';

export default function Profile() {
  return (
    <Suspense>
      <div className="max-w-2xl">
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>
        <ProfileForm />
      </div>
    </Suspense>
  );
}
