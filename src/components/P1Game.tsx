"use client";

import { useP1OutageGame } from '../hooks/useP1OutageGame';
import { RawLogViewer } from './RawLogViewer';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { AlertOctagon } from 'lucide-react';

export function P1Game() {
  const { puzzle, state, isLoaded, submitGuess, MAX_GUESSES, incorrectCount, isSubmitting, aliases, loadNextPuzzle } = useP1OutageGame();

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-text-muted">Initializing P1 Environment...</div>;
  }

  if (!puzzle || !state) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted">
        No P1 Outage found for today. Systems are green!
      </div>
    );
  }

  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4 border-b-2 border-red-500/20 pb-6">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/10 rounded-full mb-4">
          <AlertOctagon className="w-10 h-10 text-red-500" />
        </div>
        <p className="text-red-500 font-mono font-bold tracking-widest uppercase mb-2">Severity: Critical</p>
        <h2 className="text-3xl font-black text-text-main mt-2">P1 Outage Detected</h2>
        <p className="text-sm text-text-muted mt-2">
          Guesses: {state.guesses.length} / {MAX_GUESSES}
        </p>
      </div>

      <RawLogViewer puzzle={puzzle} state={state} maxGuesses={MAX_GUESSES} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          {!isWin && (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-xl w-full">
              <h3 className="text-xl font-bold text-red-500 mb-2">Systems Down</h3>
              <p className="text-text-main">You failed to resolve the P1 outage in time. The SLA has been breached.</p>
              <p className="text-text-muted text-sm mt-4">Hint: The category was &quot;{puzzle.category}&quot;.</p>
            </div>
          )}
          <button
            onClick={loadNextPuzzle}
            className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xl shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            {isWin ? "Next Incident" : "Try Another Incident"}
          </button>
        </div>
      )}
    </div>
  );
}
