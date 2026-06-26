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
    // 🟥 for wrong, 🟩 for right
    let grid = '';
    for (let i = 0; i < numGuesses; i++) {
      grid += state.guesses[i].status === 'correct' ? '🟩' : '🟥';
    }

    const verb = isWin ? 'solved in' : 'failed in';
    const text = `Techdle ${puzzleIdStr} — ${verb} ${scoreStr}\n${grid}\ntechdle.app`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (state.status === 'playing') return null;

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-6 py-3 bg-primary-hover hover:bg-primary-hover text-text-main font-bold rounded-lg transition-colors shadow-lg shadow-primary/20 mx-auto"
    >
      {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
      {copied ? 'Copied to clipboard!' : 'Share Result'}
    </button>
  );
}
