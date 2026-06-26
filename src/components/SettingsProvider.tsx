"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface SettingsContextType {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  highContrast: false,
  setHighContrast: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrastState] = useState(false);

  useEffect(() => {
    const isHC = localStorage.getItem('techdle_highContrast') === 'true';
    if (isHC) {
      setHighContrastState(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const setHighContrast = (v: boolean) => {
    setHighContrastState(v);
    localStorage.setItem('techdle_highContrast', String(v));
    if (v) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <SettingsContext.Provider value={{ highContrast, setHighContrast }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
