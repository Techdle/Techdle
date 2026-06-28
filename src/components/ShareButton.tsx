import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { GameState } from '../types/game';
import { getPuzzleNumberByDate } from '../lib/date';

interface ShareButtonProps {
  state: GameState;
  maxGuesses: number;
}

export function ShareButton({ state, maxGuesses }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const isWin = state.status === 'won';
    const numGuesses = state.guesses.length;
    
    const puzzleNumber = getPuzzleNumberByDate(state.date);
    const puzzleIdStr = puzzleNumber > 0 ? `#${puzzleNumber}` : state.date;
    
    const scoreStr = isWin ? `${numGuesses}/${maxGuesses}` : `X/${maxGuesses}`;
    
    // Generate grid
    // 🟥 for wrong, 🟩 for right, ⬜ for unused
    let grid = '';
    for (let i = 0; i < maxGuesses; i++) {
      if (i < numGuesses) {
        grid += state.guesses[i].status === 'correct' ? '🟩' : '🟥';
      } else {
        grid += '⬜';
      }
    }

    const verb = isWin ? 'solved in' : 'failed in';
    const text = `Techdle ${puzzleIdStr} — ${verb} ${scoreStr}\n${grid}\nplaytechdle.com`;

    if (navigator.share) {
      try {
        await navigator.share({ text });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to share', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  if (state.status === 'playing') return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-background font-bold rounded-lg transition-all shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 w-full sm:w-auto justify-center"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      {copied ? 'Copied to clipboard!' : 'Share Result'}
    </button>
  );
}
