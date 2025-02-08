'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { Toaster } from 'react-hot-toast';
import { SupabaseProvider } from './SupabaseProvider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SupabaseProvider>
        {children}
        <Toaster position="top-right" />
      </SupabaseProvider>
    </Provider>
  );
}
