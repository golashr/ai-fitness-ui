'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { UserIcon, Cog6ToothIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Suspense } from 'react';

const navigation = [
  { name: 'Profile', href: '/settings/profile', icon: UserIcon },
  { name: 'Preferences', href: '/settings/preferences', icon: Cog6ToothIcon },
  { name: 'Security', href: '/settings/security', icon: ShieldCheckIcon },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <Suspense>
      <ProtectedRoute>
        <div className="p-6 text-gray-900 bg-white">
          <div className="max-w-10xl mx-auto">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {navigation.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/settings' && pathname === '/settings/profile');
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`
                      flex items-center py-4 px-1 border-b-2 text-sm font-medium
                      ${
                        isActive
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                    >
                      <item.icon className="h-5 w-5 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-6">{children}</div>
          </div>
        </div>
      </ProtectedRoute>
    </Suspense>
  );
}
