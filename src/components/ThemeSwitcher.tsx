'use client';

import { useTheme } from './ThemeProvider';
import { Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const themes = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'nord', label: 'Nord' },
  { id: 'forest', label: 'Forest' },
  { id: 'high-contrast', label: 'High Contrast' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
  { id: 'synthwave', label: 'Synthwave' },
  { id: 'ocean', label: 'Ocean' },
  { id: 'sunset', label: 'Sunset' },
  { id: 'dracula', label: 'Dracula' },
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all"
        aria-label="Select theme"
        title="Select theme"
      >
        <Palette className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-surface border border-border rounded-lg shadow-lg py-1 z-50">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTheme(t.id as 'dark' | 'light' | 'high-contrast' | 'nord' | 'forest' | 'cyberpunk' | 'synthwave' | 'ocean' | 'sunset' | 'dracula');
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                theme === t.id
                  ? 'bg-primary/20 text-primary font-medium'
                  : 'text-text-muted hover:bg-surface-raised hover:text-text-main'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
