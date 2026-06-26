/**
 * Client-side puzzle loading using pre-generated build data.
 * Imported statically — tree-shaken at build time.
 * The client bundle only contains puzzle data for the current day.
 */

import { ClientPuzzle } from '@/types/game';
import clientPuzzles from '@/data/puzzles/client-puzzles.json';
import answerHashes from '@/data/puzzles/answer-hashes.json';
import { getTodayDateString, getPuzzleNumberByDate } from './date';

const allClientPuzzles: ClientPuzzle[] = (clientPuzzles as Omit<ClientPuzzle, 'answerHash' | 'number'>[]).map((p, i) => {
  // We'll attach the answerHash and real number later
  return {
    ...p,
    answerHash: '',
    number: 0,
  };
});

/**
 * LCG PRNG — must match the server-side puzzles.ts exactly.
 */
function getShuffledIndices(seed: number, length: number): number[] {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  const next = () => {
    state = (state * 16807) % 2147483647;
    return state;
  };
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = length - 1; i > 0; i--) {
    const j = next() % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

/**
 * Get today's puzzle from the client-side bundle.
 * No server action needed — all data is pre-generated at build time.
 */
export function getClientPuzzleForDate(dateStr: string): ClientPuzzle | null {
  const total = allClientPuzzles.length;
  if (total === 0) return null;

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();
  if (isNaN(targetDate) || targetDate < epoch) return null;

  const dayIndex = Math.floor((targetDate - epoch) / 86400000);
  const shuffled = getShuffledIndices(dayIndex, total);
  const pos = dayIndex % total;
  const puzzleIndex = shuffled[pos];
  const puzzle = allClientPuzzles[puzzleIndex];

  if (!puzzle) return null;

  // Attach the precomputed answer hash for this date
  const hashes = answerHashes as Record<string, string>;
  const answerHash = hashes[dateStr] || '';
  const number = getPuzzleNumberByDate(dateStr);

  return {
    ...puzzle,
    answerHash,
    number,
  };
}

export function getTodayClientPuzzle(): ClientPuzzle | null {
  return getClientPuzzleForDate(getTodayDateString());
}
