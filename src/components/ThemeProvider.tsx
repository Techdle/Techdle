"use client";

import { useCallback, useEffect, type ReactNode } from "react";

/**
 * Minimal theme provider that avoids `next-themes` script injection.
 *
 * The library `next-themes` v0.4.x renders a `<script>` tag from inside a React
 * component, which Next.js 16 rejects with:
 *   "Encountered a script tag while rendering React component."
 *
 * This replacement uses the same `class`-based strategy via a plain `<script>`
 * in the HTML `<head>` (in layout.tsx) and manages the toggle via a simple
 * React context + CSS class on `<html>`.
 */
function getTheme(): string {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("techdle-theme") || "dark";
}

function setThemeClass(theme: string) {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Sync theme on mount — localStorage is the source of truth
  useEffect(() => {
    const theme = getTheme();
    setThemeClass(theme);
  }, []);

  // Expose toggle via a global event so ThemeToggle can call it
  const toggle = useCallback(() => {
    const current = getTheme();
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("techdle-theme", next);
    setThemeClass(next);
    // Dispatch a custom event so other components can react
    window.dispatchEvent(new CustomEvent("themechange", { detail: next }));
  }, []);

  // Expose toggle on window for the ThemeToggle component
  useEffect(() => {
    (window as any).__techdleThemeToggle = toggle;
    return () => { delete (window as any).__techdleThemeToggle; };
  }, [toggle]);

  return <>{children}</>;
}
