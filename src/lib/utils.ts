import { Puzzle } from '../types/game';

export const TYPO_TOLERANCE = 2;
const EPOCH = '2026-06-25';

export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Compute SHA-256 hash of a string using the Web Crypto API.
 * Available in all modern browsers and Node 18+.
 */
export async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get the date seed string for a given day index.
 * This seeds the per-date answer hash so tomorrow's hash is different.
 */
function getDateSeed(dayIndex: number): string {
  return `techdle-v1-${dayIndex}`;
}

/**
 * Get the date seed for today (PHT timezone).
 */
export function getTodayDateSeed(): string {
  const now = new Date();
  now.setUTCHours(now.getUTCHours() + 8);
  const dateStr = now.toISOString().split('T')[0];
  const epoch = new Date(EPOCH + 'T00:00:00Z').getTime();
  const today = new Date(dateStr + 'T00:00:00Z').getTime();
  const dayIndex = Math.floor((today - epoch) / 86400000);
  return getDateSeed(dayIndex);
}

/**
 * Hash a guess against the expected answer for a given date seed.
 */
export async function hashAnswerForDate(dateSeed: string, answer: string): Promise<string> {
  const normalized = answer.toLowerCase().replace(/[^a-z0-9]/g, '');
  return sha256(dateSeed + normalized);
}

/**
 * Client-side guess validation using date-seeded hash comparison.
 * No server trip needed — the expected hash is embedded in the build.
 */
export async function isGuessCorrectClient(
  guess: string,
  puzzle: Puzzle,
  dateSeed: string,
  expectedHash: string
): Promise<boolean> {
  const normGuess = normalize(guess);
  const targets = [puzzle.answer, ...puzzle.aliases].map(normalize);

  for (const target of targets) {
    // Direct match or typo-tolerant match
    if (normGuess === target) return true;
    if (levenshteinDistance(normGuess, target) <= TYPO_TOLERANCE) return true;
  }

  // Hash-based fallback: verify against expected hash (catches aliases we might have missed)
  const guessHash = await hashAnswerForDate(dateSeed, guess);
  return guessHash === expectedHash;
}

export function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isGuessCorrect(guess: string, puzzle: Puzzle): boolean {
  const normGuess = normalize(guess);
  const targets = [puzzle.answer, ...puzzle.aliases].map(normalize);
  
  for (const target of targets) {
    if (normGuess === target) return true;
    if (levenshteinDistance(normGuess, target) <= TYPO_TOLERANCE) return true;
  }
  return false;
}
