"use client";

import { useCategoryGame } from '../hooks/useCategoryGame';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { TryOtherModesLink } from './TryOtherModesLink';
import { ArrowRight, Cpu, ShieldAlert, Network, Code2, FolderGit2 } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'Hardware', icon: Cpu, color: 'text-blue-500', bg: 'group-hover:bg-blue-500/10' },
  { id: 'Security', icon: ShieldAlert, color: 'text-red-500', bg: 'group-hover:bg-red-500/10' },
  { id: 'Network', icon: Network, color: 'text-purple-500', bg: 'group-hover:bg-purple-500/10' },
  { id: 'Software', icon: Code2, color: 'text-green-500', bg: 'group-hover:bg-green-500/10' },
];

export function CategoryGame() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!selectedCategory) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center animate-in fade-in duration-500">
        <FolderGit2 className="w-16 h-16 text-primary mb-6" />
        <h2 className="text-3xl font-bold text-text-main mb-2">Category Drill</h2>
        <p className="text-text-muted mb-10 text-center max-w-md">
          Select a category to practice specific types of tickets. Solve as many consecutive tickets as you can!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <div className={`p-4 bg-surface-raised rounded-xl mr-6 transition-colors ${cat.bg}`}>
                  <Icon className={`w-8 h-8 ${cat.color} transition-colors`} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-text-main text-xl mb-1">{cat.id}</span>
                  <span className="block text-sm text-text-muted">Start Drilling</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return <CategoryGameRunner category={selectedCategory} />;
}

function CategoryGameRunner({ category }: { category: string }) {
  const { 
    puzzle, state, isLoaded, submitGuess, loadNextPuzzle, 
    MAX_GUESSES, incorrectCount, isSubmitting, aliases 
  } = useCategoryGame(category);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-64 text-text-muted">Loading game data...</div>;
  }

  if (!puzzle || !state) {
    return (
      <div className="flex justify-center items-center h-64 text-text-muted">
        No puzzles available for {category}.
      </div>
    );
  }

  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';
  const streak = state.consecutiveCorrect || 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8 animate-in fade-in">
      <div className="text-center mb-4 relative">
        <div className="absolute right-0 top-0 text-right">
          <div className="text-xs text-text-muted uppercase tracking-wider font-bold">Streak</div>
          <div className="text-3xl font-black text-primary font-mono">{streak}</div>
        </div>
        <p className="text-primary font-bold tracking-wider uppercase text-sm mb-2">{category} Drill</p>
        <p className="text-text-muted font-mono">Ticket #{puzzle.id.slice(0, 8)}</p>
        <h2 className="text-2xl font-bold text-text-main mt-2">Identify the Root Cause</h2>
        <p className="text-sm text-text-muted mt-2">
          Guesses: {state.guesses.length} / {MAX_GUESSES}
        </p>
      </div>

      <ClueList puzzle={puzzle} state={state} />

      {!isGameOver ? (
        <GuessInput onSubmit={submitGuess} disabled={isSubmitting} shakeKey={incorrectCount} targets={aliases} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col items-center">
          {state.fullPuzzle && <ResolutionTicket puzzle={state.fullPuzzle} isWin={isWin} />}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full">
            <ShareButton state={state} maxGuesses={MAX_GUESSES} />
            <TryOtherModesLink />
          </div>
          <button
            onClick={loadNextPuzzle}
            className="w-full sm:w-auto px-8 py-3 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 mt-4"
          >
            Next Ticket in {category} <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
