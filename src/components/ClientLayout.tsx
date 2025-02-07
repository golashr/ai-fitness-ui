"use client";

import { RootProvider } from "@/providers/RootProvider";
import Header from "./Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </RootProvider>
  );
} 