"use client";

import { useGame } from '../hooks/useGame';
import { useAuth } from './AuthProvider';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { RefreshCw, Bug } from 'lucide-react';
import { LandingPage } from './LandingPage';
import { useState, useEffect } from 'react';

interface GameProps {
  onTutorialTrigger?: () => void;
}

export function Game({ onTutorialTrigger }: GameProps = {}) {
  const { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases } = useGame();
  const { isDevMode } = useAuth();
  
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    if (isLoaded && state && state.guesses.length > 0) {
      setShowLanding(false);
    }
  }, [isLoaded, state]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-slate-400">Loading game data...</div>;
  }

  if (!puzzle || !state) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400">
        No puzzle found for today. Check back tomorrow!
      </div>
    );
  }

  const handlePlay = () => {
    setShowLanding(false);
    onTutorialTrigger?.();
  };

  if (showLanding && state.guesses.length === 0) {
    return <LandingPage onPlay={handlePlay} puzzleNumber={puzzle.number} />;
  }

  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  const revealAnswer = () => {
    // Reveal answer doesn't work easily via client now without the answer. 
    // Since it's dev mode only, we could fetch it, but let's just alert for now.
    alert("Reveal answer disabled in Server-Side Validation mode.");
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">
        {isDevMode && !isGameOver && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={resetGame}
              className="flex items-center gap-1.5 text-xs font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full transition-colors"
              title="Restart puzzle (dev mode)"
            >
              <RefreshCw className="w-3 h-3" />
              Restart
            </button>
            <button
              onClick={revealAnswer}
              className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3 py-1.5 rounded-full transition-colors"
              title="Reveal answer (dev mode)"
            >
              <Bug className="w-3 h-3" />
              Reveal
            </button>
          </div>
        )}
        <p className="text-slate-400 font-mono">Ticket #{puzzle.number.toString().padStart(3, '0')}</p>
        <h2 className="text-2xl font-bold text-slate-200 mt-2">Identify the Root Cause</h2>
        <p className="text-sm text-slate-500 mt-2">
          Guesses: {state.guesses.length} / {MAX_GUESSES}
        </p>
      </div>

      <ClueList puzzle={puzzle} state={state} maxGuesses={MAX_GUESSES} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          <ShareButton state={state} maxGuesses={MAX_GUESSES} />
          {isDevMode && (
            <div className="flex justify-center">
              <button
                onClick={resetGame}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-amber-900/20"
              >
                <RefreshCw className="w-5 h-5" />
                Play Again (Dev Mode)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
