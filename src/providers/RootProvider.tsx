'use client';

import { ReduxProvider } from './ReduxProvider';
import { SupabaseProvider } from './SupabaseProvider';
import { Toaster } from 'react-hot-toast';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SupabaseProvider>
        {children}
        <Toaster position="top-right" />
      </SupabaseProvider>
    </ReduxProvider>
  );
}
