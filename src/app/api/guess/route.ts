import { NextResponse } from 'next/server';
import puzzlesData from '@/data/puzzles/index.json';
import { Puzzle } from '@/types/game';

const allPuzzles = puzzlesData as Puzzle[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { puzzleId, guess, isGameOver } = body;

    if (!puzzleId || !guess) {
      return NextResponse.json(
        { error: 'Missing puzzleId or guess' },
        { status: 400 }
      );
    }

    const fullPuzzle = allPuzzles.find((p) => p.id === puzzleId);

    if (!fullPuzzle) {
      return NextResponse.json(
        { error: 'Puzzle not found' },
        { status: 404 }
      );
    }

    const { isGuessCorrect } = await import('@/lib/utils');
    const isCorrect = isGuessCorrect(guess, fullPuzzle);

    if (isCorrect || isGameOver) {
      return NextResponse.json({ correct: isCorrect, fullPuzzle });
    } else {
      return NextResponse.json({ correct: false });
    }
  } catch (error) {
    console.error('Error validating guess:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
