'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userDetails } = useAppSelector((state) => state.session);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Check if we're on reset password page
  const isResetPasswordPage = pathname?.startsWith('/auth/reset-password');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    router.push('/signout');
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200">
      <nav className="px-4">
        <div className="flex justify-end h-16">
          <div className="flex items-center space-x-4">
            {!isResetPasswordPage && userDetails ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none"
                >
                  {userDetails.avatar_url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={userDetails.avatar_url}
                        alt="Profile"
                        fill
                        sizes="(max-width: 768px) 32px, 32px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {userDetails.name?.[0] || userDetails.email?.[0] || '?'}
                      </span>
                    </div>
                  )}
                  <span className="text-gray-700 hidden sm:block">
                    {userDetails.name || userDetails.email}
                  </span>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/signin" className="text-gray-900 hover:text-gray-700 font-medium">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
