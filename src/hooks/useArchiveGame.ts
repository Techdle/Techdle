import { useState, useEffect, useCallback } from 'react';
import { Puzzle, GameState, Guess, ArchiveResult } from '../types/game';
import { getPuzzleByDate } from '../lib/puzzles';
import { saveArchiveResult } from '../lib/storage';
import { isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 6;

export function useArchiveGame(date: string) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    setPuzzle(null);
    setState(null);
    setIsLoaded(false);
    setIncorrectCount(0);

    const activePuzzle = getPuzzleByDate(date);

    if (!activePuzzle) {
      setIsLoaded(true);
      return;
    }

    setPuzzle(activePuzzle);
    setState({
      puzzleId: activePuzzle.id,
      date: date,
      guesses: [],
      status: 'playing',
      lastPlayedAt: Date.now(),
    });
    setIsLoaded(true);
  }, [date]);

  const submitGuess = useCallback((guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing') return;

    const correct = isGuessCorrect(guessText, puzzle);
    const newGuess: Guess = { text: guessText, status: correct ? 'correct' : 'incorrect' };
    const newGuesses = [...state.guesses, newGuess];

    if (!correct) {
      setIncorrectCount(c => c + 1);
    }

    let newStatus: 'playing' | 'won' | 'lost' = state.status;
    if (correct) {
      newStatus = 'won';
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = 'lost';
    }

    const newState: GameState = {
      ...state,
      guesses: newGuesses,
      status: newStatus,
      lastPlayedAt: Date.now(),
    };

    setState(newState);

    if (newStatus !== 'playing') {
      const result: ArchiveResult = {
        puzzleId: puzzle.id,
        date: state.date,
        status: newStatus as 'won' | 'lost',
        guessesCount: newGuesses.length,
        solvedOnTime: false
      };
      saveArchiveResult(result);
    }
  }, [state, puzzle]);

  return { puzzle, state, isLoaded, submitGuess, MAX_GUESSES, incorrectCount };
}
