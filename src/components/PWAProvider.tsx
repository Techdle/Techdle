"use client";

import { useEffect } from "react";

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Small timeout to not block main thread during hydration/initial load
      setTimeout(() => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.error('Service Worker registration failed: ', err);
        });
      }, 0);
    }
  }, []);

  return <>{children}</>;
}
