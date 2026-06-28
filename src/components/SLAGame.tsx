"use client";

import { useSLATimeAttack } from '../hooks/useSLATimeAttack';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { RotateCcw, Timer } from 'lucide-react';
import { useEffect, useState } from 'react';

const INITIAL_TIME_MS = 60000;

export function SLAGame() {
  const { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases, timeRemaining } = useSLATimeAttack();
  
  // Format time remaining
  const seconds = Math.max(0, Math.ceil(timeRemaining / 1000));
  const isWarning = timeRemaining < 15000;
  const isCritical = timeRemaining < 5000;
  
  const timerColorClass = isCritical ? 'text-red-500' : isWarning ? 'text-orange-500' : 'text-primary';
  const progressPercent = Math.min(100, Math.max(0, (timeRemaining / INITIAL_TIME_MS) * 100));
  const progressBarColorClass = isCritical ? 'bg-red-500' : isWarning ? 'bg-orange-500' : 'bg-primary';

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-text-muted">Loading SLA environment...</div>;
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
  // You don't "win" SLA mode, you just survive until time is out. 
  // It's always a "loss" in terms of resolution ticket since the SLA was breached.

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      {/* SLA Status Header */}
      <div className="flex flex-col mb-4 bg-surface rounded-xl border border-border overflow-hidden">
        {/* Progress Bar */}
        <div className="w-full h-2 bg-surface-raised">
          <div 
            className={`h-full transition-all duration-100 ease-linear ${progressBarColorClass}`} 
            style={{ width: `${progressPercent}%` }} 
          />
        </div>
        
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-surface-raised ${timerColorClass}`}>
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-text-muted font-mono text-xs uppercase tracking-wider">SLA Remaining</p>
              <h2 className={`text-2xl font-black font-mono ${timerColorClass}`}>{seconds}s</h2>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted uppercase tracking-wider font-bold">Tickets Resolved</p>
            <p className="text-3xl font-black text-text-main font-mono">{state.score || 0}</p>
          </div>
        </div>
      </div>

      <ClueList puzzle={puzzle} state={state} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          
          <div className="text-center mb-4">
            <h2 className="text-4xl font-black text-red-500 mb-2 uppercase tracking-widest">SLA Breached</h2>
            <p className="text-xl text-text-main">Final Score: <span className="font-bold">{state.score || 0}</span> tickets</p>
          </div>

          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={false} />}
          
          <button
            onClick={resetGame}
            className="w-full sm:w-auto px-8 py-4 bg-surface-raised hover:bg-surface-raised text-text-main font-bold rounded-full text-xl border border-border transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}
