"use client";

import Link from 'next/link';
import { Settings, BookOpen, HelpCircle, Terminal, Menu, X } from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { GameMode } from '../types/game';
import { useState } from 'react';

interface HeaderProps {
  onOpenHelp?: () => void;
  mode?: GameMode | null;
}

const MODE_LABELS: Record<GameMode, string> = {
  daily: 'Daily',
  endless: 'Endless Queue',
  'sla-time-attack': 'SLA Time Attack',
  'p1-outage': 'P1 Outage',
  'category': 'Category Drill',
};

export function Header({ onOpenHelp, mode }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-1.5 sm:gap-4">
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 text-text-main hover:text-primary transition-colors">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight font-serif">Techdle</h1>
          </Link>

          {mode && (
            <div className="px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-bold tracking-wide flex-shrink-0 whitespace-nowrap truncate max-w-[120px] sm:max-w-none">
              {MODE_LABELS[mode]}
            </div>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {onOpenHelp && (
            <button onClick={onOpenHelp} className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="How To Play">
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
          <Link href="/dictionary" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Answer Dictionary">
            <BookOpen className="w-5 h-5" />
          </Link>
          <Link href="/archive" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Archive">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </Link>
          <Link href="/stats" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Stats">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"></rect><rect x="10" y="8" width="4" height="13"></rect><rect x="2" y="13" width="4" height="8"></rect></svg>
          </Link>
          <Link href="/login" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Account">
            <Settings className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-border mx-2" />
          <ThemeSwitcher />
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {/* Keep ThemeSwitcher visible on mobile header for quick access, or put it in menu? Let's put it in menu and only keep hamburger icon here, or maybe keep ThemeSwitcher here so it's always accessible. Let's keep ThemeSwitcher and Hamburger. */}
          <ThemeSwitcher />
          <div className="w-px h-6 bg-border mx-1" />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-surface border-b border-border shadow-lg py-2 px-4 flex flex-col gap-1 z-50">
          {onOpenHelp && (
            <button onClick={() => { onOpenHelp(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all w-full text-left">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium">How To Play</span>
            </button>
          )}
          <Link href="/dictionary" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Answer Dictionary</span>
          </Link>
          <Link href="/archive" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span className="font-medium">Archive</span>
          </Link>
          <Link href="/stats" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"></rect><rect x="10" y="8" width="4" height="13"></rect><rect x="2" y="13" width="4" height="8"></rect></svg>
            <span className="font-medium">Stats</span>
          </Link>
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Account Settings</span>
          </Link>
        </div>
      )}
    </header>
  );
}

