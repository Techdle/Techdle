"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Header } from '@/components/Header';
import { getDailyPuzzleIndex } from '@/lib/puzzles';
import { getTodayDateString } from '@/lib/date';
import { loadArchiveResults, loadGameState } from '@/lib/storage';
import { Puzzle, ArchiveResult, GameState } from '@/types/game';
import { HeatmapGraph } from '@/components/HeatmapGraph';

export default function ArchivePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [archiveResults, setArchiveResults] = useState<ArchiveResult[]>([]);
  const [todayState, setTodayState] = useState<GameState | null>(null);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    import('@/lib/puzzles').then(m => m.fetchPuzzleMetadata()).then(data => {
      setPuzzles(data);
    });
    setArchiveResults(loadArchiveResults());
    setTodayState(loadGameState());
    setTodayStr(getTodayDateString());
  }, []);

  // Wait until todayStr is initialized
  if (!todayStr) {
    return (
      <div className="min-h-[100dvh] bg-background text-text-main font-sans">
        <Header />
      </div>
    );
  }

  // Generate dates from epoch through today (not locked to one cycle)
  const epoch = new Date('2026-06-25T00:00:00Z');
  const today = new Date(todayStr + 'T00:00:00Z');
  const validDates: string[] = [];
  if (today >= epoch) {
    const msPerDay = 86400000;
    const totalDays = Math.floor((today.getTime() - epoch.getTime()) / msPerDay) + 1;
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(epoch.getTime() + i * msPerDay);
      validDates.push(d.toISOString().substring(0, 10));
    }
  } else {
    // Before epoch: just show epoch day
    validDates.push('2026-06-25');
  }

  // Get distinct months from the valid dates
  const months = validDates.reduce((acc, dateStr) => {
    const m = dateStr.substring(0, 7); // yyyy-MM
    if (!acc.includes(m)) acc.push(m);
    return acc;
  }, [] as string[]);

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8">Archive</h2>
        <HeatmapGraph archiveResults={archiveResults} todayStr={todayStr} />

        <div className="space-y-12">
          {months.map(monthStr => {
            const firstDay = parseISO(`${monthStr}-01`);
            const daysInMonth = eachDayOfInterval({
              start: startOfMonth(firstDay),
              end: endOfMonth(firstDay),
            });

            return (
              <div key={monthStr} className="bg-surface rounded-xl p-6 border border-border">
                <h3 className="text-xl font-semibold mb-4">{format(firstDay, 'MMMM yyyy')}</h3>
                <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-text-muted mb-2">
                  <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {daysInMonth.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd');
                    const hasPuzzle = validDates.includes(dateStr);
                    const isToday = dateStr === todayStr;
                    
                    let puzzle: any = undefined;
                    if (hasPuzzle && puzzles.length > 0) {
                      const epochMs = new Date('2026-06-25T00:00:00Z').getTime();
                      const targetMs = new Date(dateStr + 'T00:00:00Z').getTime();
                      if (!isNaN(targetMs) && targetMs >= epochMs) {
                        const dayIndex = Math.floor((targetMs - epochMs) / 86400000);
                        const selectedIndex = getDailyPuzzleIndex(dayIndex, puzzles.length);
                        puzzle = puzzles[selectedIndex];
                      }
                    }

                    if (isToday) {
                      status = 'today';
                      if (todayState && todayState.status !== 'playing') {
                        status = todayState.status as 'won' | 'lost';
                      }
                    } else if (puzzle) {
                      const archRes = archiveResults.find(r => r.date === dateStr || r.puzzleId === puzzle.id);
                      if (archRes) {
                        status = archRes.status;
                      }
                    }

                    // Padding for first day of month
                    const gridColStart = date.getDate() === 1 ? date.getDay() + 1 : 'auto';

                    if (!puzzle) {
                      return (
                        <div
                          key={dateStr}
                          className="aspect-square flex items-center justify-center rounded-lg bg-background/50 text-text-muted"
                          style={{ gridColumnStart: gridColStart }}
                        >
                          {date.getDate()}
                        </div>
                      );
                    }

                    let bgClass = 'bg-surface-raised hover:bg-surface-raised text-text-muted border-2 border-transparent';
                    const isWin = status === 'won' || (status === 'today' && todayState?.status === 'won');
                    const isLoss = status === 'lost' || (status === 'today' && todayState?.status === 'lost');

                    if (isLoss) {
                       bgClass = 'bg-error/80 text-white border-2 border-transparent';
                    } else if (isWin) {
                       let guesses = 6;
                       let solvedOnTime = true;
                       if (status === 'today' && todayState && todayState.status === 'won') {
                          guesses = todayState.guesses.length;
                       } else {
                          const archRes = archiveResults.find(r => r.date === dateStr || (puzzle && r.puzzleId === puzzle.id));
                          if (archRes) {
                            guesses = archRes.guessesCount;
                            solvedOnTime = archRes.solvedOnTime ?? false;
                          }
                       }

                       if (!solvedOnTime) {
                          bgClass = 'bg-transparent border-2 border-success/80 text-success';
                       } else {
                          if (guesses === 1) bgClass = 'bg-success text-white border-2 border-transparent';
                          else if (guesses <= 3) bgClass = 'bg-success/80 text-white border-2 border-transparent';
                          else if (guesses <= 5) bgClass = 'bg-success/60 text-white border-2 border-transparent';
                          else bgClass = 'bg-success/40 text-white border-2 border-transparent';
                       }
                    }

                    if (isToday) {
                      bgClass += ' ring-2 ring-primary shadow-lg shadow-primary/30';
                    }

                    const inner = (
                      <div className={`w-full h-full aspect-square flex flex-col items-center justify-center rounded-lg transition-colors ${bgClass}`}>
                        <span className="text-lg">{date.getDate()}</span>
                      </div>
                    );

                    const isFuture = dateStr > todayStr;
                    return (
                      <div key={dateStr} style={{ gridColumnStart: gridColStart }}>
                        {isToday ? (
                          <Link href="/">{inner}</Link>
                        ) : isFuture ? (
                          <div className="cursor-not-allowed opacity-40">
                            <div className="w-full h-full aspect-square flex flex-col items-center justify-center rounded-lg border border-transparent bg-surface-raised text-text-muted">
                              <span className="text-lg">{date.getDate()}</span>
                            </div>
                          </div>
                        ) : (
                          <Link href={`/archive/${dateStr}`}>{inner}</Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
