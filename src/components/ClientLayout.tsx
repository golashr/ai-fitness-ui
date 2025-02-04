"use client";

import { Providers } from "@/providers/Providers";
import Header from "./Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <Header />
      <main className="pt-16">
        {children}
      </main>
    </Providers>
  );
} 