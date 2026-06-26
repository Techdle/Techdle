"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Header } from '@/components/Header';
import { getAllPuzzles, getPuzzleByDate } from '@/lib/puzzles';
import { getTodayDateString } from '@/lib/date';
import { loadArchiveResults, loadGameState } from '@/lib/storage';
import { Puzzle, ArchiveResult, GameState } from '@/types/game';

export default function ArchivePage() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [archiveResults, setArchiveResults] = useState<ArchiveResult[]>([]);
  const [todayState, setTodayState] = useState<GameState | null>(null);
  const [todayStr, setTodayStr] = useState('');

  useEffect(() => {
    setPuzzles(getAllPuzzles());
    setArchiveResults(loadArchiveResults());
    setTodayState(loadGameState());
    setTodayStr(getTodayDateString());
  }, []);

  // Generate exactly one cycle of dates from epoch
  const numPuzzles = getAllPuzzles().length;
  const epoch = new Date('2026-06-25T00:00:00Z');
  const validDates: string[] = [];
  for (let i = 0; i < numPuzzles; i++) {
    const d = new Date(epoch.getTime() + i * 86400000);
    validDates.push(d.toISOString().substring(0, 10)); // yyyy-MM-dd
  }

  // Get distinct months from the valid dates
  const months = validDates.reduce((acc, dateStr) => {
    const m = dateStr.substring(0, 7); // yyyy-MM
    if (!acc.includes(m)) acc.push(m);
    return acc;
  }, [] as string[]);

  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-4xl mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold mb-8">Archive</h2>

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
                    const puzzle = hasPuzzle ? getPuzzleByDate(dateStr) : undefined;
                    const isToday = dateStr === todayStr;

                    let status: 'unplayed' | 'won' | 'lost' | 'today' = 'unplayed';

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

                    let bgClass = 'bg-surface-raised hover:bg-surface-raised text-text-muted';
                    if (status === 'won') bgClass = 'bg-success/60 border border-success text-success';
                    if (status === 'lost') bgClass = 'bg-error/60 border border-error text-error';
                    if (status === 'today') bgClass = 'bg-primary/60 border border-primary text-primary shadow-lg shadow-primary/30';

                    const inner = (
                      <div className={`w-full h-full aspect-square flex flex-col items-center justify-center rounded-lg transition-colors border border-transparent ${bgClass}`}>
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
