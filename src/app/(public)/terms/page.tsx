import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Fitness',
  description: 'Read our terms of service and legal information.',
  // ... other meta tags
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-white p-8 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      {/* Content */}
    </div>
  );
}
