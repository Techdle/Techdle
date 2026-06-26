"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Settings, Bug, BookOpen, HelpCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from './AuthProvider';

export function Header({ onOpenHelp }: { onOpenHelp?: () => void }) {
  const { isDevMode } = useAuth();

  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-slate-100 hover:text-blue-400 transition-colors">
          <Image src="/icon.svg" alt="Techdle Icon" width={24} height={24} className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-tight">Techdle</h1>
          {isDevMode && (
            <span className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full ml-2">
              <Bug className="w-3 h-3" />
              Dev
            </span>
          )}
        </Link>

        <nav className="flex items-center gap-2">
          {onOpenHelp && (
            <button onClick={onOpenHelp} className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all" title="How To Play">
              <HelpCircle className="w-5 h-5" />
            </button>
          )}
          <Link href="/dictionary" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all" title="Answer Dictionary">
            <BookOpen className="w-5 h-5" />
          </Link>
          <Link href="/archive" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all" title="Archive">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </Link>
          <Link href="/stats" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all" title="Stats">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="18" y="3" width="4" height="18"></rect><rect x="10" y="8" width="4" height="13"></rect><rect x="2" y="13" width="4" height="8"></rect></svg>
          </Link>
          <Link href="/login" className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all" title="Account">
            <Settings className="w-5 h-5" />
          </Link>
          <div className="w-px h-6 bg-slate-800 mx-2" />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
