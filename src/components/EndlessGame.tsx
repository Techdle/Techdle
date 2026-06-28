"use client";

import { useEndlessGame } from '../hooks/useEndlessGame';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { SignupPromptModal } from './SignupPromptModal';
import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';
import { safeGetItem } from '../lib/storage';

export function EndlessGame() {
  const { puzzle, state, isLoaded, submitGuess, resetGame, loadNextPuzzle, MAX_GUESSES, incorrectCount, isSubmitting, aliases } = useEndlessGame();
  const { user, loading: authLoading } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);

  useEffect(() => {
    if (isLoaded && state && state.status !== 'playing' && !authLoading && (!user || user.isAnonymous)) {
      const hasSeenPrompt = safeGetItem('hasSeenSignupPrompt');
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setShowSignupPrompt(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, state, user, authLoading]);
  
  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-text-muted">Loading queue...</div>;
  }

  if (!puzzle || !state) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted flex-col gap-4">
        <p>No puzzles left! You&apos;ve cleared the queue.</p>
        <button 
          onClick={resetGame}
          className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-surface-raised rounded-full border border-border"
        >
          <RotateCcw className="w-4 h-4" /> Start Over
        </button>
      </div>
    );
  }

  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="flex justify-between items-center mb-4 bg-surface p-4 rounded-xl border border-border">
        <div>
          <p className="text-text-muted font-mono text-sm">Ticket Queue</p>
          <h2 className="text-xl font-bold text-text-main">Identify Root Cause</h2>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted uppercase tracking-wider font-bold">Streak</p>
          <p className="text-3xl font-black text-primary font-mono">{state.consecutiveCorrect || 0}</p>
        </div>
      </div>

      <ClueList puzzle={puzzle} state={state} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          
          {isWin ? (
            <button
              onClick={loadNextPuzzle}
              className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-background font-bold rounded-full text-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              Next Ticket <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <p className="text-lg font-bold text-text-main">Streak broken at {state.consecutiveCorrect || 0}!</p>
              <button
                onClick={resetGame}
                className="w-full sm:w-auto px-8 py-4 bg-surface-raised hover:bg-surface-raised text-text-main font-bold rounded-full text-xl border border-border transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" /> Try Again
              </button>
            </div>
          )}
        </div>
      )}

      <SignupPromptModal 
        isOpen={showSignupPrompt} 
        onClose={() => setShowSignupPrompt(false)} 
      />
    </div>
  );
}
