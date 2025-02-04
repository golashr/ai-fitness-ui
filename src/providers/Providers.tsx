"use client";

import { ReduxProvider } from "@/providers/ReduxProvider";
import { SessionProvider } from "@/providers/SessionProvider";
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SessionProvider>
        {children}
        <Toaster position="top-right" />
      </SessionProvider>
    </ReduxProvider>
  );
} 