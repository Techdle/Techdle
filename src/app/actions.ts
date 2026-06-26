"use server";

import { Puzzle, ClientPuzzle, GuessStatus } from '@/types/game';
import { getTodayPuzzle, getPuzzleById, getAllAliases, getPuzzleNumber } from '@/lib/puzzles';
import { isGuessCorrect } from '@/lib/utils';

export async function getClientPuzzleAction(dateStr: string): Promise<ClientPuzzle | null> {
  // We ignore dateStr for simplicity and just get today's puzzle. 
  // We can also strictly use dateStr if needed, but getTodayPuzzle works server-side.
  const puzzle = getTodayPuzzle();
  if (!puzzle) return null;

  return {
    id: puzzle.id,
    number: getPuzzleNumber(puzzle.id),
    category: puzzle.category,
    difficulty: puzzle.difficulty,
    clues: puzzle.clues,
  };
}

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
  const status: GuessStatus = correct ? 'correct' : 'incorrect';
  
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
  // Shuffle to prevent ordering hints (like alphabetical or grouped by topic)
  for (let i = aliases.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [aliases[i], aliases[j]] = [aliases[j], aliases[i]];
  }
  return aliases;
}
