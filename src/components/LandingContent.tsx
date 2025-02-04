'use client';

import Link from 'next/link';

export default function LandingContent() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-100 justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-gray-900">Welcome to AI Fitness Planner</h1>
      <p className="text-xl mb-8 text-gray-900">
        Get personalized workout plans tailored to your goals and preferences.
      </p>
      <div className="flex gap-4">
        <Link
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </Link>
        <Link
          href="/auth/signin"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </Link>
      </div>
    </main>
  );
}
