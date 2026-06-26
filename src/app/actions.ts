"use server";

import { Puzzle } from '@/types/game';
import { getPuzzleById, getAllAliases } from '@/lib/puzzles';
import { isGuessCorrect } from '@/lib/utils';

/**
 * Fetch the full puzzle data after a game ends (for ResolutionTicket).
 * Called once when restoring a completed game from localStorage.
 */
export async function getFullPuzzleAction(puzzleId: string): Promise<Puzzle | null> {
  const puzzle = getPuzzleById(puzzleId);
  return puzzle || null;
}

/**
 * Deprecated: guess validation is now handled client-side via hash comparison.
 * Kept for backward compatibility with any existing saved states.
 */
export async function verifyGuessAction(
  puzzleId: string,
  guessText: string,
  currentGuessesCount: number,
  maxGuesses: number
): Promise<{
  correct: boolean;
  status: 'correct' | 'incorrect';
  isGameOver: boolean;
  fullPuzzle?: Puzzle;
}> {
  const puzzle = getPuzzleById(puzzleId);
  if (!puzzle) {
    throw new Error('Puzzle not found');
  }

  const correct = isGuessCorrect(guessText, puzzle);
  const status: 'correct' | 'incorrect' = correct ? 'correct' : 'incorrect';

  const nextGuessesCount = currentGuessesCount + 1;
  const isGameOver = correct || nextGuessesCount >= maxGuesses;

  if (isGameOver) {
    return {
      correct,
      status,
      isGameOver,
      fullPuzzle: puzzle,
    };
  }

  return {
    correct,
    status,
    isGameOver: false,
  };
}

export async function getAllAliasesAction(): Promise<string[]> {
  const aliases = getAllAliases();
  // Shuffle to prevent ordering hints
  for (let i = aliases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [aliases[i], aliases[j]] = [aliases[j], aliases[i]];
  }
  return aliases;
}
