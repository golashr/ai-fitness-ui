'use client';
import { useEffect } from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Providers from '@/providers/Providers';
import { enableReactDebugging } from '@/utils/devtools';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    enableReactDebugging();
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
