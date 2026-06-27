"use client";

import { useDailyGame } from '../hooks/useDailyGame';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { TryOtherModesLink } from './TryOtherModesLink';
import { useEffect } from 'react';

interface DailyGameProps {
  onTutorialTrigger?: () => void;
}

export function DailyGame({ onTutorialTrigger }: DailyGameProps) {
  const { puzzle, state, isLoaded, submitGuess, MAX_GUESSES, incorrectCount, isSubmitting, aliases } = useDailyGame();

  useEffect(() => {
    if (isLoaded && state && state.guesses.length === 0) {
      onTutorialTrigger?.();
    }
  }, [isLoaded, state, onTutorialTrigger]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-text-muted">Loading game data...</div>;
  }

  if (!puzzle || !state) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted">
        No puzzle found for today. Check back tomorrow!
      </div>
    );
  }

  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">
        <p className="text-text-muted font-mono">Ticket #{puzzle.number.toString().padStart(3, '0')}</p>
        <h2 className="text-2xl font-bold text-text-main mt-2">Identify the Root Cause</h2>
        <p className="text-sm text-text-muted mt-2">
          Guesses: {state.guesses.length} / {MAX_GUESSES}
        </p>
      </div>

      <ClueList puzzle={puzzle} state={state} maxGuesses={MAX_GUESSES} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <ShareButton state={state} maxGuesses={MAX_GUESSES} />
            <TryOtherModesLink />
          </div>
        </div>
      )}
    </div>
  );
}
