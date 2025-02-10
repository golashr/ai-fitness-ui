import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About AI Fitness - Our Mission and Vision',
  description:
    "Learn about AI Fitness and how we're revolutionizing personal fitness with artificial intelligence.",
  // ... other meta tags
};

export default function About() {
  return (
    <div className="min-h-screen bg-white p-8 bg-gray-100">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">About AI Fitness</h1>
      {/* Content */}
    </div>
  );
}
