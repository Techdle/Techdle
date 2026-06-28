'use client';

import { safeGetItem, safeSetItem } from '../lib/storage';
import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useEasterEggs } from '@/hooks/useEasterEggs';

export type Theme = 'dark' | 'light' | 'high-contrast' | 'nord' | 'forest' | 'cyberpunk' | 'synthwave' | 'ocean' | 'sunset' | 'dracula';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  favorites: Theme[];
  toggleFavorite: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  useEasterEggs();
  const [theme, setThemeState] = useState<Theme>('dark');
  const [favorites, setFavoritesState] = useState<Theme[]>([]);

  useEffect(() => {
    const savedTheme = (safeGetItem('techdle-theme') as Theme) || 'dark';
    if (savedTheme !== theme) {
      setThemeState(savedTheme); // eslint-disable-line react-hooks/set-state-in-effect
    }
    
    try {
      const savedFavorites = JSON.parse(safeGetItem('techdle-theme-favorites') || '[]');
      if (Array.isArray(savedFavorites)) {
        setFavoritesState(savedFavorites as Theme[]);
      }
    } catch(e) {}
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    safeSetItem('techdle-theme', newTheme);
    setThemeState(newTheme);
    document.documentElement.dataset.theme = newTheme;
  }, []);

  const toggleFavorite = useCallback((favTheme: Theme) => {
    setFavoritesState(prev => {
      const newFavorites = prev.includes(favTheme) 
        ? prev.filter(t => t !== favTheme) 
        : [...prev, favTheme];
      safeSetItem('techdle-theme-favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, favorites, toggleFavorite }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
