import { useState, useEffect, useCallback } from 'react';
import { ClientPuzzle, GameState, Guess, ArchiveResult } from '../types/game';
import { getDailyPuzzleId, fetchPuzzleChunk } from '../lib/puzzles';
import { saveArchiveResult } from '../lib/storage';

const MAX_GUESSES = 6;

export function useArchiveGame(date: string) {
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      setPuzzle(null);
      setState(null);
      setIsLoaded(false);
      setIncorrectCount(0);

      try {
        const activePuzzleId = await getDailyPuzzleId(date);

        if (!activePuzzleId) {
          if (mounted) setIsLoaded(true);
          return;
        }

        const activePuzzle = await fetchPuzzleChunk(activePuzzleId);
        if (!mounted) return;
        setPuzzle(activePuzzle);
        
        setState({
          puzzleId: activePuzzle.id,
          date: date,
          guesses: [],
          status: 'playing',
          lastPlayedAt: Date.now(),
        });
      } catch (err) {
        console.error("Failed to load archive game:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }
    
    loadInitialData();
    return () => { mounted = false; };
  }, [date]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const isGameOver = state.guesses.length + 1 >= MAX_GUESSES;

      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId: state.puzzleId, guess: guessText, isGameOver }),
      });
      const data = await res.json();
      
      const correct = data.correct === true;
      const fullPuzzle = data.fullPuzzle;

      const status: 'correct' | 'incorrect' = correct ? 'correct' : 'incorrect';
      const newGuess: Guess = { text: guessText, status };
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
        ...(newStatus !== 'playing' && fullPuzzle ? { fullPuzzle } : {}),
      };

      setState(newState);

      if (newStatus !== 'playing') {
        const result: ArchiveResult = {
          puzzleId: state.puzzleId,
          date: state.date,
          status: newStatus as 'won' | 'lost',
          guessesCount: newGuesses.length,
          solvedOnTime: false
        };
        saveArchiveResult(result);
      }
    } catch (err) {
      console.error("Failed to submit archive guess:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, isSubmitting]);

  return { puzzle, state, isLoaded, submitGuess, MAX_GUESSES, incorrectCount, isSubmitting };
}
