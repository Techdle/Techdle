import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, Puzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode, loadUserStats, saveUserStats, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getDailyP1Puzzle } from '../lib/puzzles';
import { isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 3;
const MODE = 'p1-outage';

export function useP1OutageGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<(Puzzle & { rawLogs: string[] }) | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // P1 mode intentionally doesn't provide autocomplete, but we return an empty array to satisfy the interface
  const aliases: string[] = []; 

  useEffect(() => {
    async function loadInitialData() {
      const todayDate = getTodayDateString();
      const activePuzzle = getDailyP1Puzzle(todayDate);

      if (!activePuzzle) {
        setIsLoaded(true);
        return;
      }

      setPuzzle(activePuzzle);

      const savedState = loadGameStateByMode(MODE);

      if (savedState && savedState.puzzleId === activePuzzle.id && savedState.date === todayDate) {
        if (savedState.status !== 'playing' && !savedState.fullPuzzle) {
          savedState.fullPuzzle = activePuzzle;
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
      setIsLoaded(true);
    }

    loadInitialData();
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
      const correct = isGuessCorrect(guessText, puzzle);

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
        ...(newStatus !== 'playing' ? { fullPuzzle: puzzle } : {}),
      };

      setState(newState);

      // We share stats with daily for now, as requested in plan (or keep separate?)
      // Plan: "Same stats tracking as daily per-date"
      if (newStatus !== 'playing') {
        const stats = loadUserStats();
        // Since P1 might be played same day as Daily, we might double-count totalPlayed?
        // Let's just track it as part of daily stats.
        stats.totalPlayed += 1;
        if (newStatus === 'won') {
          stats.wins += 1;
          const guessCount = newGuesses.length as 1 | 2 | 3 | 4 | 5 | 6;
          // Only track up to 3 for P1, but we use the existing distribution
          stats.guessDistribution[guessCount] += 1;
        } else {
          stats.guessDistribution.loss += 1;
        }
        
        // Let's NOT update streak for P1 so it doesn't mess with daily streak.
        // Or we just update stats unconditionally.
        saveUserStats(stats);
        if (user) {
          syncStatsToFirestore(user.uid, stats);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isSubmitting]);

  const resetGame = useCallback(async () => {
    // Cannot reset P1, it's deterministic per day.
  }, []);

  return { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases };
}
