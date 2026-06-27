import { Puzzle } from '../types/game';
import puzzlesData from '../data/puzzles/index.json';
import { getTodayDateString } from './date';

// Static import — O(1) file read, <1MB even for years of puzzles.
const allPuzzles: Puzzle[] = puzzlesData as Puzzle[];

export function getAllPuzzles(): Puzzle[] {
  return [...allPuzzles].sort((a, b) => a.id.localeCompare(b.id));
}

export function getPuzzleById(id: string): Puzzle | undefined {
  return allPuzzles.find((p) => p.id === id);
}

// LCG PRNG for shuffling
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

export function getDailyPuzzleIndex(dayIndex: number, totalPuzzles: number): number {
  if (totalPuzzles === 0) return 0;

  const cycle = Math.floor(dayIndex / totalPuzzles);
  const pos = dayIndex % totalPuzzles;

  const shuffled = getShuffledIndices(cycle + 12345, totalPuzzles);

  if (cycle > 0) {
    const prevShuffled = getShuffledIndices(cycle - 1 + 12345, totalPuzzles);
    if (shuffled[0] === prevShuffled[totalPuzzles - 1]) {
      if (totalPuzzles > 1) {
        [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
      }
    }
  }

  return shuffled[pos];
}

export function getPuzzleByDate(dateStr: string): Puzzle | undefined {
  if (allPuzzles.length === 0) return undefined;

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();

  if (isNaN(targetDate) || targetDate < epoch) return undefined;

  const dayIndex = Math.floor((targetDate - epoch) / 86400000);

  const sortedPuzzles = getAllPuzzles();
  const selectedIndex = getDailyPuzzleIndex(dayIndex, sortedPuzzles.length);

  return sortedPuzzles[selectedIndex];
}

export function getTodayPuzzle(): Puzzle | undefined {
  return getPuzzleByDate(getTodayDateString());
}



export function getAllAliases(): string[] {
  const aliasSet = new Set<string>();
  allPuzzles.forEach((p) => {
    aliasSet.add(p.answer.toLowerCase());
    (p.aliases || []).forEach((a) => aliasSet.add(a.toLowerCase()));
  });
  return Array.from(aliasSet);
}

export function getRandomPuzzle(excludeIds: Set<string>): Puzzle | undefined {
  const pool = allPuzzles.filter(p => !excludeIds.has(p.id));
  if (pool.length === 0) return undefined; // exhausted, caller reshuffles
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomPuzzleByCategory(category: string, excludeIds: Set<string>): Puzzle | undefined {
  const pool = allPuzzles.filter(p => p.category === category && !excludeIds.has(p.id));
  if (pool.length === 0) return undefined; // exhausted, caller reshuffles
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getDailyP1Puzzle(dateStr: string): (Puzzle & { rawLogs: string[] }) | undefined {
  const hardPuzzles = allPuzzles.filter(p => p.difficulty === 'Hard');
  if (hardPuzzles.length === 0) return undefined;

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();

  if (isNaN(targetDate) || targetDate < epoch) return undefined;

  const dayIndex = Math.floor((targetDate - epoch) / 86400000);

  const selected = hardPuzzles[getDailyPuzzleIndex(dayIndex, hardPuzzles.length)];
  return { ...selected, rawLogs: selected.rawLogs ?? [] };
}
