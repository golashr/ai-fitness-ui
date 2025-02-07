'use client';
import { Providers } from '@/redux/provider';
import ClientLayout from '@/components/ClientLayout';
import { enableReactDebugging } from '@/utils/devtools';
import './globals.css';
import { useEffect } from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    enableReactDebugging();
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
