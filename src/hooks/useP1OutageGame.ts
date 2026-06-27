import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, ClientPuzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode, loadUserStats, saveUserStats, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getDailyP1PuzzleId, fetchPuzzleChunk } from '../lib/puzzles';

const MAX_GUESSES = 3;
const MODE = 'p1-outage';

export function useP1OutageGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<(ClientPuzzle & { rawLogs?: string[] }) | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const aliases: string[] = []; 

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const todayDate = getTodayDateString();
        const activePuzzleId = await getDailyP1PuzzleId(todayDate);

        if (!activePuzzleId) {
          if (mounted) setIsLoaded(true);
          return;
        }

        const activePuzzle = await fetchPuzzleChunk(activePuzzleId);
        if (!mounted) return;
        setPuzzle(activePuzzle);

        const savedState = loadGameStateByMode(MODE);

        if (savedState && savedState.puzzleId === activePuzzle.id && savedState.date === todayDate) {
          if (savedState.status !== 'playing' && !savedState.fullPuzzle) {
            const res = await fetch('/api/guess', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ puzzleId: activePuzzle.id, guess: 'restore', isGameOver: true }),
            });
            const data = await res.json();
            if (data.fullPuzzle) {
              savedState.fullPuzzle = data.fullPuzzle;
            }
          }
          setState(savedState);
          setIncorrectCount(savedState.guesses.filter(g => g.status === 'incorrect').length);
        } else {
          setState({
            puzzleId: activePuzzle.id,
            date: todayDate,
            guesses: [],
            status: 'playing',
            lastPlayedAt: Date.now(),
            mode: MODE,
          });
        }
      } catch (err) {
        console.error("Failed to load P1 game:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (state) {
      saveGameStateByMode(MODE, state);
    }
  }, [state]);

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
        setIncorrectCount((c) => c + 1);
      }

      let newStatus: 'playing' | 'won' | 'lost' = state.status;
      if (correct || newGuesses.length >= MAX_GUESSES) {
        newStatus = correct ? 'won' : 'lost';
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
        const stats = loadUserStats();
        stats.totalPlayed += 1;
        if (newStatus === 'won') {
          stats.wins += 1;
          const guessCount = newGuesses.length as 1 | 2 | 3 | 4 | 5 | 6;
          stats.guessDistribution[guessCount] += 1;
        } else {
          stats.guessDistribution.loss += 1;
        }
        
        saveUserStats(stats);
        if (user) {
          syncStatsToFirestore(user.uid, stats);
        }
      }
    } catch (err) {
      console.error("Failed to submit guess:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isSubmitting]);

  const resetGame = useCallback(async () => {
    // Cannot reset P1, it's deterministic per day.
  }, []);

  return { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases };
}
