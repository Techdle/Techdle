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
  { 
    id: 'Hardware', 
    icon: Cpu, 
    color: 'text-primary', 
    bg: 'group-hover:bg-primary/10',
    border: 'group-hover:border-primary/50',
    description: 'Diagnose physical components, broken drives, and power issues.' 
  },
  { 
    id: 'Security', 
    icon: ShieldAlert, 
    color: 'text-error', 
    bg: 'group-hover:bg-error/10',
    border: 'group-hover:border-error/50',
    description: 'Investigate breaches, malware, and unauthorized access.' 
  },
  { 
    id: 'Network', 
    icon: Network, 
    color: 'text-warning', 
    bg: 'group-hover:bg-warning/10',
    border: 'group-hover:border-warning/50',
    description: 'Fix connectivity drops, DNS routing, and firewall blocks.' 
  },
  { 
    id: 'Software', 
    icon: Code2, 
    color: 'text-success', 
    bg: 'group-hover:bg-success/10',
    border: 'group-hover:border-success/50',
    description: 'Debug application crashes, bugs, and OS-level failures.' 
  },
];

export function CategoryGame() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!selectedCategory) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-4 flex flex-col items-center animate-in fade-in duration-500">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="relative p-4 bg-surface border border-border rounded-2xl shadow-sm">
            <FolderGit2 className="w-10 h-10 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-text-main mb-3">Category Drill</h2>
        <p className="text-text-muted mb-12 text-center max-w-md leading-relaxed">
          Select a category to practice specific types of tickets. Solve as many consecutive tickets as you can!
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-start p-6 sm:p-8 bg-surface hover:bg-surface border border-border rounded-2xl transition-all hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] cursor-pointer group ${cat.border}`}
              >
                <div className={`p-4 bg-surface-raised rounded-xl mb-5 transition-colors ${cat.bg}`}>
                  <Icon className={`w-8 h-8 ${cat.color} transition-colors`} />
                </div>
                <div className="text-left">
                  <span className="block font-bold text-text-main text-xl mb-2 group-hover:text-primary transition-colors">{cat.id}</span>
                  <span className="block text-sm text-text-muted leading-relaxed">{cat.description}</span>
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
