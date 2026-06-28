"use client";

import Link from 'next/link';
import { Settings, BookOpen, Terminal, Menu, X, Trophy, UserCircle } from 'lucide-react';
import { GameMode } from '../types/game';
import { useState } from 'react';

interface HeaderProps {
  mode?: GameMode | null;
}

const MODE_LABELS: Record<GameMode, string> = {
  daily: 'Daily',
  endless: 'Endless Queue',
  'sla-time-attack': 'SLA Time Attack',
  'p1-outage': 'P1 Outage',
  'category': 'Category Drill',
};

export function Header({ mode }: HeaderProps) {
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
          <Link href="/dictionary" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Answer Dictionary">
            <BookOpen className="w-5 h-5" />
          </Link>
          <Link href="/leaderboard" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Leaderboard">
            <Trophy className="w-5 h-5" />
          </Link>
          <Link href="/profile" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Profile">
            <UserCircle className="w-5 h-5" />
          </Link>
          <Link href="/settings" className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all" title="Settings">
            <Settings className="w-5 h-5" />
          </Link>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="flex md:hidden items-center gap-2">
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
          <Link href="/dictionary" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <BookOpen className="w-5 h-5" />
            <span className="font-medium">Answer Dictionary</span>
          </Link>
          <Link href="/leaderboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Leaderboard</span>
          </Link>
          <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <UserCircle className="w-5 h-5" />
            <span className="font-medium">Profile</span>
          </Link>
          <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-3 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-all">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </div>
      )}
    </header>
  );
}

