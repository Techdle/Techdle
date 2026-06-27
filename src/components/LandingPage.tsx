import { Terminal, Calendar, Play } from 'lucide-react';
import Link from 'next/link';
import { Footer } from './Footer';
import { getTodayDateString } from '../lib/date';

interface LandingPageProps {
  onPlay: () => void;
  puzzleNumber: number;
}

export function LandingPage({ onPlay, puzzleNumber }: LandingPageProps) {
  const dateString = getTodayDateString(); // YYYY-MM-DD
  const [y, m, d] = dateString.split('-');
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;

  return (
    <div className="fixed inset-0 h-[100dvh] z-[60] bg-background flex flex-col items-center px-6 animate-in fade-in duration-500">
      <div className="flex-grow w-full max-w-lg flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 delay-150 fill-mode-both mx-auto">
      <div className="bg-surface border border-border p-6 rounded-3xl shadow-2xl mb-8">
        <Terminal className="w-20 h-20 text-primary" />
      </div>
      
      <h1 className="text-5xl font-black text-text-main mb-6 tracking-tight font-serif">
        Techdle
      </h1>
      
      <p className="text-xl text-text-muted mb-10 max-w-sm leading-relaxed font-medium">
        Get 6 chances to guess the root cause of today's IT ticket.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link
          href="/login"
          className="w-48 py-4 bg-surface-raised hover:bg-surface-raised text-text-main font-bold rounded-full text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-border"
        >
          Log In
        </Link>
        <button
          onClick={onPlay}
          className="w-48 py-4 bg-text-main hover:bg-text-main text-background font-bold rounded-full text-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Play
        </button>
      </div>

      <div className="flex flex-col items-center text-text-muted font-mono text-sm space-y-1 bg-surface/50 px-6 py-4 rounded-xl border border-border/50">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </span>
        <span>No. {puzzleNumber.toString().padStart(3, '0')}</span>
      </div>
      </div>
      
      <div className="w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
