import { ClientPuzzle } from '../types/game';
import { getTodayDateString } from './date';

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

let metadataPromise: Promise<any[]> | null = null;
export async function fetchPuzzleMetadata(): Promise<any[]> {
  if (!metadataPromise) {
    metadataPromise = fetch('/puzzles/metadata.json').then(res => {
      if (!res.ok) throw new Error('Failed to fetch metadata');
      return res.json();
    }).catch(err => {
      metadataPromise = null;
      throw err;
    });
  }
  return metadataPromise;
}

const chunkCache = new Map<string, Promise<ClientPuzzle>>();
export async function fetchPuzzleChunk(id: string): Promise<ClientPuzzle> {
  if (!chunkCache.has(id)) {
    const promise = fetch(`/puzzles/${id}.json`).then(res => {
      if (!res.ok) throw new Error(`Failed to fetch puzzle chunk ${id}`);
      return res.json();
    }).catch(err => {
      chunkCache.delete(id);
      throw err;
    });
    chunkCache.set(id, promise);
  }
  return chunkCache.get(id)!;
}

let dictionaryPromise: Promise<string[]> | null = null;
export async function fetchDictionary(): Promise<string[]> {
  if (!dictionaryPromise) {
    dictionaryPromise = fetch('/dictionary.json').then(res => {
      if (!res.ok) throw new Error('Failed to fetch dictionary');
      return res.json();
    }).catch(err => {
      dictionaryPromise = null;
      throw err;
    });
  }
  return dictionaryPromise;
}

export async function getDailyPuzzleId(dateStr: string): Promise<string | undefined> {
  const metadata = await fetchPuzzleMetadata();
  if (metadata.length === 0) return undefined;

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();

  if (isNaN(targetDate) || targetDate < epoch) return undefined;

  const dayIndex = Math.floor((targetDate - epoch) / 86400000);
  const selectedIndex = getDailyPuzzleIndex(dayIndex, metadata.length);

  return metadata[selectedIndex].id;
}

export async function getTodayPuzzleId(): Promise<string | undefined> {
  return getDailyPuzzleId(getTodayDateString());
}

export async function getRandomPuzzleId(excludeIds: Set<string>): Promise<string | undefined> {
  const metadata = await fetchPuzzleMetadata();
  const pool = metadata.filter(p => !excludeIds.has(p.id));
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export async function getRandomPuzzleIdByCategory(category: string, excludeIds: Set<string>): Promise<string | undefined> {
  const metadata = await fetchPuzzleMetadata();
  const pool = metadata.filter(p => p.category === category && !excludeIds.has(p.id));
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

export async function getDailyP1PuzzleId(dateStr: string): Promise<string | undefined> {
  const metadata = await fetchPuzzleMetadata();
  const hardPuzzles = metadata.filter(p => p.difficulty === 'Hard');
  if (hardPuzzles.length === 0) return undefined;

  const epoch = new Date('2026-06-25T00:00:00Z').getTime();
  const targetDate = new Date(dateStr + 'T00:00:00Z').getTime();

  if (isNaN(targetDate) || targetDate < epoch) return undefined;

  const dayIndex = Math.floor((targetDate - epoch) / 86400000);
  const selectedIndex = getDailyPuzzleIndex(dayIndex, hardPuzzles.length);

  return hardPuzzles[selectedIndex].id;
}

export async function getRandomP1PuzzleId(excludeIds: Set<string>): Promise<string | undefined> {
  const metadata = await fetchPuzzleMetadata();
  const pool = metadata.filter(p => p.difficulty === 'Hard' && !excludeIds.has(p.id));
  if (pool.length === 0) return undefined;
  return pool[Math.floor(Math.random() * pool.length)].id;
}
