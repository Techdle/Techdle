"use client";

import { useDailyGame } from '../hooks/useDailyGame';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { TryOtherModesLink } from './TryOtherModesLink';
import { SignupPromptModal } from './SignupPromptModal';
import { useAuth } from './AuthProvider';
import { useEffect, useState } from 'react';
import { safeGetItem } from '../lib/storage';
import { AdBanner } from './AdBanner';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface DailyGameProps {
  onTutorialTrigger?: () => void;
}

export function DailyGame({ onTutorialTrigger }: DailyGameProps) {
  const { puzzle, state, isLoaded, submitGuess, startTimer, MAX_GUESSES, incorrectCount, isSubmitting, aliases } = useDailyGame();
  const { user, loading: authLoading } = useAuth();
  const [showSignupPrompt, setShowSignupPrompt] = useState(false);
  const isXlScreen = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    if (isLoaded && state && state.guesses.length === 0) {
      onTutorialTrigger?.();
    }
  }, [isLoaded, state, onTutorialTrigger]);

  useEffect(() => {
    if (isLoaded && state && state.status !== 'playing' && !authLoading && (!user || user.isAnonymous)) {
      const hasSeenPrompt = safeGetItem('hasSeenSignupPrompt');
      if (!hasSeenPrompt) {
        const timer = setTimeout(() => {
          setShowSignupPrompt(true);
        }, 1500); // Wait a bit for the game over animations
        return () => clearTimeout(timer);
      }
    }
  }, [isLoaded, state, user, authLoading]);

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

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(state.date + 'T00:00:00Z').getTime();
  const puzzleNumber = puzzle.number ?? (!isNaN(targetDate) ? Math.floor((targetDate - epoch) / 86400000) + 1 : 1);

  return (
    <div className="w-full mx-auto flex justify-between items-stretch gap-8 px-4 xl:px-12 2xl:px-24">
      {/* Left Ad Gutter */}
      <div className="hidden xl:block w-[160px] flex-shrink-0 py-8">
        <div className="sticky top-8 h-[600px]">
          {isXlScreen && <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_LEFT" orientation="vertical" />}
        </div>
      </div>

      {/* Main Game Container */}
      <div className="w-full max-w-3xl py-8 flex flex-col gap-8">
      <div className="text-center mb-4">
        <p className="text-text-muted font-mono">Ticket #{puzzleNumber.toString().padStart(3, '0')}</p>
        <h2 className="text-2xl font-bold text-text-main mt-2">Identify the Root Cause</h2>
        <p className="text-sm text-text-muted mt-2">
          Guesses: {state.guesses.length} / {MAX_GUESSES}
        </p>
      </div>

      <ClueList puzzle={puzzle} state={state} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} onType={startTimer} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <ShareButton state={state} maxGuesses={MAX_GUESSES} />
            <TryOtherModesLink />
          </div>
        </div>
      )}

      <SignupPromptModal 
        isOpen={showSignupPrompt} 
        onClose={() => setShowSignupPrompt(false)} 
      />
      </div>

      {/* Right Ad Gutter */}
      <div className="hidden xl:block w-[160px] flex-shrink-0 py-8">
        <div className="sticky top-8 h-[600px]">
          {isXlScreen && <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_RIGHT" orientation="vertical" />}
        </div>
      </div>
    </div>
  );
}
