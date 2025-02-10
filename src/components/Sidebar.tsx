'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, HeartIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useAppSelector } from '@/redux/hooks';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Fitness', href: '/dashboard/fitness', icon: HeartIcon },
  { name: 'Refer & Earn', href: '/dashboard/refer', icon: UserGroupIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { userDetails } = useAppSelector((state) => state.session);

  return (
    <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col border-r border-gray-200">
      <div className="flex min-h-screen flex-col bg-white">
        <nav className="flex-1 space-y-1 px-2 py-4">
          <div className="text-xl text-gray-900 px-2 mb-8">
            <Link
              href={userDetails ? '/dashboard' : '/'}
              className="flex items-center text-gray-900 font-bold text-lg"
            >
              AI Fitness
            </Link>
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-6 w-6 flex-shrink-0 ${
                    isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
