'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Providers from '@/providers/Providers';
import { enableReactDebugging } from '@/utils/devtools';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage =
    pathname?.startsWith('/auth/') || pathname === '/signin' || pathname === '/signup';

  useEffect(() => {
    enableReactDebugging();
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          {isAuthPage ? (
            children
          ) : (
            <div className="min-h-screen bg-white">
              <Sidebar />
              <div className="md:pl-64 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-gray-50">{children}</main>
                <Footer />
              </div>
            </div>
          )}
        </Providers>
      </body>
    </html>
  );
}
