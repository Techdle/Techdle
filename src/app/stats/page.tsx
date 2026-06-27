"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { loadUserStats, loadGameState, validateAndRepairStats, saveUserStats } from '@/lib/storage';
import { UserStats, GameState } from '@/types/game';
import { getTodayDateString } from '@/lib/date';

export default function StatsPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [todayState, setTodayState] = useState<GameState | null>(null);

  useEffect(() => {
    const rawStats = loadUserStats();
    const cleaned = validateAndRepairStats(rawStats);
    // If stats were repaired, persist the fix
    if (JSON.stringify(cleaned) !== JSON.stringify(rawStats)) {
      saveUserStats(cleaned);
    }
    setStats(cleaned);
    const state = loadGameState();
    const todayStr = getTodayDateString();
    if (state && state.date === todayStr && state.status !== 'playing') {
      setTodayState(state);
    }
  }, []);

  if (!stats) {
    return (
      <div className="min-h-[100dvh] font-sans">
        <Header />
        <main className="max-w-xl mx-auto py-8 px-4 animate-pulse">
          <div className="h-8 w-48 bg-surface-raised rounded mx-auto mb-8"></div>
          <div className="grid grid-cols-4 gap-4 mb-12">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-surface rounded-lg border border-border"></div>
            ))}
          </div>
          <div className="h-6 w-48 bg-surface-raised rounded mb-6"></div>
          <div className="space-y-3">
            {[1,2,3,4,5,6,7].map(i => (
              <div key={i} className="flex gap-3 items-center" >
                <div className="w-4 h-4 bg-surface-raised rounded" />
                <div className="flex-1 h-8 bg-surface rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const winPercentage = stats.totalPlayed === 0 ? 0 : Math.round((stats.wins / stats.totalPlayed) * 100);

  // For chart scaling
  const maxGuessCount = Math.max(
    ...Object.values(stats.guessDistribution)
  );

  return (
    <div className="min-h-[100dvh] font-sans">
      <Header />
      <main className="max-w-xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Your Stats</h2>
        
        {/* Top level stats */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <div className="text-3xl font-bold text-text-main">{stats.totalPlayed}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">Played</div>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <div className="text-3xl font-bold text-text-main">{winPercentage}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">Win %</div>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <div className="text-3xl font-bold text-text-main">{stats.currentStreak}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">Current Streak</div>
          </div>
          <div className="text-center p-4 bg-surface rounded-lg border border-border">
            <div className="text-3xl font-bold text-text-main">{stats.maxStreak}</div>
            <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">Max Streak</div>
          </div>
        </div>

        {/* Guess Distribution */}
        <h3 className="text-xl font-semibold mb-6">Guess Distribution</h3>
        <div className="space-y-3">
          {([1, 2, 3, 4, 5, 6] as const).map(guessNum => {
            const count = stats.guessDistribution[guessNum];
            const percent = maxGuessCount === 0 ? 0 : (count / maxGuessCount) * 100;
            // minimum width to ensure number is visible
            const width = Math.max(percent, 7); 
            const isToday = todayState?.status === 'won' && todayState.guesses.length === guessNum;
            const barColor = isToday ? 'bg-success' : 'bg-primary-hover';
            
            return (
              <div key={guessNum} className="flex items-center gap-3">
                <div className="w-4 font-mono text-text-muted">{guessNum}</div>
                <div className="flex-1 bg-surface rounded h-8 overflow-hidden">
                  <div 
                    className={`${barColor} h-full flex items-center justify-end px-2 text-xs font-bold transition-all duration-1000 ease-out text-text-main`}
                    style={{ width: `${width}%` }}
                  >
                    {count > 0 ? count : ''}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            <div className="w-4 font-mono text-error">X</div>
            <div className="flex-1 bg-surface rounded h-8 overflow-hidden">
              <div 
                className={`${todayState?.status === 'lost' ? 'bg-error text-text-main' : 'bg-error/60 text-error'} h-full flex items-center justify-end px-2 text-xs font-bold transition-all duration-1000 ease-out`}
                style={{ width: `${Math.max(maxGuessCount === 0 ? 0 : (stats.guessDistribution.loss / maxGuessCount) * 100, 7)}%` }}
              >
                {stats.guessDistribution.loss > 0 ? stats.guessDistribution.loss : ''}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
