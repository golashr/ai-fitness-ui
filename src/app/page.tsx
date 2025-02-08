import { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import LandingContent from '@/components/LandingContent';
import { Suspense } from 'react';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'AI Fitness - Your Personal AI-Powered Fitness Companion',
  description:
    'Get customized workout plans and nutrition advice tailored just for you with AI Fitness. Transform your fitness journey with personalized AI guidance.',
  keywords: 'AI fitness, personal trainer, workout plans, nutrition advice, fitness app',
  openGraph: {
    title: 'AI Fitness - Your Personal AI-Powered Fitness Companion',
    description: 'Get customized workout plans and nutrition advice tailored just for you.',
    type: 'website',
    url: 'https://ai-fitness.com',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AI Fitness',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Fitness - Your Personal AI-Powered Fitness Companion',
    description: 'Get customized workout plans and nutrition advice tailored just for you.',
    images: ['/twitter-image.jpg'],
  },
};

export default function Home() {
  return (
    <Suspense>
      <ProtectedRoute>
        <LandingContent />
      </ProtectedRoute>
    </Suspense>
  );
}
