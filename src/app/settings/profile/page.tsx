'use client';

import ProfileForm from './components/ProfileForm';

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Profile Information</h2>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
}
