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
    <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col items-center justify-center px-6 animate-in fade-in duration-500">
      <div className="w-full max-w-lg flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-700 delay-150 fill-mode-both">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-2xl mb-8">
        <Terminal className="w-20 h-20 text-blue-500" />
      </div>
      
      <h1 className="text-5xl font-black text-slate-100 mb-6 tracking-tight font-serif">
        Techdle
      </h1>
      
      <p className="text-xl text-slate-300 mb-10 max-w-sm leading-relaxed font-medium">
        Get 6 chances to guess the root cause of today's IT ticket.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
        <Link
          href="/login"
          className="w-48 py-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold rounded-full text-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-slate-700"
        >
          Log In
        </Link>
        <button
          onClick={onPlay}
          className="w-48 py-4 bg-slate-100 hover:bg-white text-slate-950 font-bold rounded-full text-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-current" />
          Play
        </button>
      </div>

      <div className="flex flex-col items-center text-slate-500 font-mono text-sm space-y-1 bg-slate-900/50 px-6 py-4 rounded-xl border border-slate-800/50">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          {formattedDate}
        </span>
        <span>No. {puzzleNumber.toString().padStart(3, '0')}</span>
      </div>
      </div>
      
      <div className="absolute bottom-0 w-full">
        <Footer />
      </div>
    </div>
  );
}
