import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - AI Fitness',
  description: 'Read our terms of service and legal information.',
  // ... other meta tags
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        {/* Content */}
      </main>
    </div>
  );
}
