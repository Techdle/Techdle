"use client";

import { useEffect, ReactNode } from "react";
import { useAuth } from "./AuthProvider";

export function SecurityProvider({ children }: { children: ReactNode }) {
  const { isDevMode } = useAuth();

  useEffect(() => {
    // Disable keyboard shortcuts for DevTools unless in Dev Mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isDevMode) return;
      
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
  }, [isDevMode]);

  return <>{children}</>;
}
