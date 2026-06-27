"use client";

import { useEffect, ReactNode } from "react";
export function SecurityProvider({ children }: { children: ReactNode }) {

  useEffect(() => {
    // Disable keyboard shortcuts for DevTools
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
        (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'U')) ||
        (e.ctrlKey && e.key === 'U') ||
        (e.metaKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return <>{children}</>;
}
