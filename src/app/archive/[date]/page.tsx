'use client';

import { use, useEffect } from 'react';
import { GameBoard } from '@/components/GameBoard';
import { useArchiveGame } from '@/hooks/useArchiveGame';
import { Header } from '@/components/Header';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function ArchiveGamePage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = use(params);
  const { puzzle, state, isLoaded, submitGuess, MAX_GUESSES, incorrectCount } = useArchiveGame(date);

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-background text-text-main">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="flex flex-col items-center gap-4 text-text-muted">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-mono text-sm">Loading historical ticket...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!puzzle || !state) {
    return (
      <main className="min-h-screen bg-background text-text-main">
        <Header />
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] px-4">
          <Terminal className="w-16 h-16 text-text-muted mb-6" />
          <h2 className="text-2xl font-bold text-text-main mb-2">Ticket Not Found</h2>
          <p className="text-text-muted text-center max-w-md mb-8">
            The requested historical puzzle could not be loaded. It may not exist or has not been released yet.
          </p>
          <Link 
            href="/archive"
            className="flex items-center gap-2 px-6 py-3 bg-primary-hover hover:bg-primary text-text-main rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Archive
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-text-main flex flex-col">
      <Header />
      
      <div className="flex-1 w-full max-w-3xl mx-auto p-4 flex flex-col">
        <div className="mb-6 flex items-center gap-3">
          <Link 
            href="/archive"
            className="p-2 -ml-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-lg transition-colors"
            title="Back to Archive"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-main">Archive Mode</h1>
            <p className="text-text-muted text-sm flex items-center gap-2 mt-1">
              <span className="font-mono bg-surface-raised px-2 py-0.5 rounded text-xs">{date}</span>
              <span>·</span>
              <span className="text-warning">{puzzle.difficulty}</span>
              <span>·</span>
              <span className="text-primary">{puzzle.category}</span>
            </p>
          </div>
        </div>

        <GameBoard
          puzzle={puzzle}
          state={state}
          onSubmit={submitGuess}
          maxGuesses={MAX_GUESSES}
          incorrectCount={incorrectCount}
        />
      </div>
    </main>
  );
}
