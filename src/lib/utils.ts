import { Puzzle } from '../types/game';

export const TYPO_TOLERANCE = 2;

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
