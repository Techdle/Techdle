import { Terminal, Calendar, Play, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { Footer } from './Footer';
import { getTodayDateString } from '../lib/date';
import { GameMode } from '../types/game';

interface LandingPageProps {
  onSelectMode: (mode: GameMode) => void;
  puzzleNumber: number;
}

export function LandingPage({ onSelectMode, puzzleNumber }: LandingPageProps) {
  const dateString = getTodayDateString(); // YYYY-MM-DD
  const [y, m, d] = dateString.split('-');
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;

  return (
    <div className="fixed inset-0 min-h-[100dvh] z-[60] bg-background flex flex-col items-center px-6 animate-in fade-in duration-500 overflow-y-auto pt-12 pb-8">
      <div className="flex-grow w-full max-w-lg flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 delay-150 fill-mode-both mx-auto">
        <div className="bg-surface border border-border p-6 rounded-3xl shadow-2xl mb-6">
          <Terminal className="w-20 h-20 text-primary" />
        </div>
        
        <h1 className="text-5xl font-black text-text-main mb-3 tracking-tight font-serif">
          Techdle
        </h1>

        <div className="flex items-center justify-center gap-2 text-text-muted font-mono text-sm mb-6">
          <Calendar className="w-4 h-4" />
          <span>Ticket No.{puzzleNumber.toString().padStart(3, '0')} &middot; {formattedDate}</span>
        </div>
        
        <p className="text-xl text-text-muted mb-8 max-w-sm leading-relaxed font-medium">
          Get 6 chances to guess the root cause of today's IT ticket.
        </p>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-6">
            <Link
              href="/login"
              className="w-48 py-4 bg-surface hover:bg-surface-raised text-text-main font-bold rounded-full text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-border"
            >
              Log In
            </Link>
            <button
              onClick={() => onSelectMode('daily')}
              className="w-48 py-4 bg-primary hover:bg-primary/90 text-background font-bold rounded-full text-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>
          </div>
          
          <Link
            href="/modes"
            className="text-base font-bold text-text-muted hover:text-text-main transition-colors flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Other Gamemodes
          </Link>
        </div>
      </div>
      
      <div className="w-full mt-auto pt-8">
        <Footer />
      </div>
    </div>
  );
}
