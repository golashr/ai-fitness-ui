import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About AI Fitness - Our Mission and Vision',
  description: 'Learn about AI Fitness and how we\'re revolutionizing personal fitness with artificial intelligence.',
  // ... other meta tags
};

export default function About() {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About AI Fitness</h1>
        {/* Content */}
      </main>
    </div>
  );
} 