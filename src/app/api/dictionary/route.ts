import { NextResponse } from 'next/server';
import puzzlesData from '@/data/puzzles/index.json';
import { Puzzle } from '@/types/game';

const allPuzzles = puzzlesData as Puzzle[];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const unlockedIds: string[] = body.unlockedIds || [];
    const unlockedSet = new Set(unlockedIds);

    const dictionary = allPuzzles.map((p) => ({
      id: p.id,
      category: p.category,
      answer: p.answer,
      explanation: p.explanation,
      fixSteps: p.fixSteps || [],
      // Only include clues if the user has unlocked this puzzle
      clues: unlockedSet.has(p.id) ? p.clues : []
    }));

    // Sort alphabetically by answer
    dictionary.sort((a, b) => a.answer.localeCompare(b.answer));

    return NextResponse.json(dictionary);
  } catch (error) {
    console.error('Error fetching dictionary:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
