"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getTheme(): string {
  if (typeof window === "undefined") return "dark";
  return localStorage.getItem("techdle-theme") || "dark";
}

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setThemeState] = useState("dark");

  useEffect(() => {
    setThemeState(getTheme());
    setMounted(true);

    // Listen for theme changes from other tabs/components
    const handler = (e: CustomEvent) => setThemeState(e.detail);
    window.addEventListener("themechange", handler as EventListener);
    return () => window.removeEventListener("themechange", handler as EventListener);
  }, []);

  const toggle = () => {
    const toggleFn = (window as any).__techdleThemeToggle;
    if (toggleFn) {
      toggleFn();
      // Our state will be updated by the themechange event listener
    }
  };

  if (!mounted) {
    return <div className="w-9 h-9" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={toggle}
      className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
