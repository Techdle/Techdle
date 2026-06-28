import { useState, useEffect, useCallback } from 'react';
import { ClientPuzzle, GameState, Guess } from '../types/game';
import { getTodayDateString, getYesterdayDateString } from '../lib/date';
import { loadGameState, saveGameState, loadUserStats, saveUserStats, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { fetchDictionary, fetchPuzzleChunk, getTodayPuzzleId } from '../lib/puzzles';
import { decodeClientPuzzle, isGuessCorrect, processGuessLogic } from '../lib/utils';

const MAX_GUESSES = 6;

export function useDailyGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const todayDate = getTodayDateString();
        const activePuzzleId = await getTodayPuzzleId();

        if (!activePuzzleId) {
          if (mounted) setIsLoaded(true);
          return;
        }

        const activePuzzle = await fetchPuzzleChunk(activePuzzleId);
        if (!mounted) return;
        setPuzzle(activePuzzle);

        const dict = await fetchDictionary();
        if (!mounted) return;
        setAliases(dict);

        let savedState = loadGameState();

        if (savedState && savedState.puzzleId === activePuzzle.id && savedState.date === todayDate) {
          // If game is over but we don't have the fullPuzzle in state, decode it locally
          if (savedState.status !== 'playing' && !savedState.fullPuzzle) {
            savedState.fullPuzzle = decodeClientPuzzle(activePuzzle);
          }
          setState(savedState);
        } else {
          setState({
            puzzleId: activePuzzle.id,
            date: todayDate,
            guesses: [],
            status: 'playing',
            lastPlayedAt: Date.now(),
            mode: 'daily',
          });
        }
      } catch (err) {
        console.error("Failed to load daily game:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (state) {
      saveGameState(state);
    }
  }, [state]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { newState, isCorrect } = processGuessLogic(state, puzzle, guessText, MAX_GUESSES);

      if (!isCorrect) {
        setIncorrectCount((c) => c + 1);
      }

      setState(newState);

      if (newState.status !== 'playing') {
        const stats = loadUserStats();
        const today = getTodayDateString();

        if (stats.lastPlayedDate !== today) {
          const oldLastPlayed = stats.lastPlayedDate;
          stats.totalPlayed += 1;
          stats.lastPlayedDate = today;

          if (newState.status === 'won') {
            stats.wins += 1;
            const yesterdayStr = getYesterdayDateString();

            if (oldLastPlayed === yesterdayStr) {
              stats.currentStreak += 1;
            } else {
              stats.currentStreak = 1;
            }

            if (stats.currentStreak > stats.maxStreak) {
              stats.maxStreak = stats.currentStreak;
            }
            const guessCount = newState.guesses.length as 1 | 2 | 3 | 4 | 5 | 6;
            stats.guessDistribution[guessCount] += 1;
          } else {
            stats.currentStreak = 0;
            stats.guessDistribution.loss += 1;
          }

          saveUserStats(stats);
          if (user) {
            syncStatsToFirestore(user.uid, stats);
          }
        }

        const result: import('../types/game').ArchiveResult = {
          puzzleId: state.puzzleId,
          date: state.date,
          status: newState.status as 'won' | 'lost',
          guessesCount: newState.guesses.length,
          solvedOnTime: true
        };
        import('../lib/storage').then(mod => {
          mod.saveArchiveResult(result);
          if (user) {
            mod.syncArchiveToFirestore(user.uid, result);
          }
        });
      }
    } catch (err) {
      console.error("Failed to submit guess:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isSubmitting]);

  const resetGame = useCallback(async () => {
    try {
      const todayDate = getTodayDateString();
      const activePuzzleId = await getTodayPuzzleId();
      if (!activePuzzleId) return;
      
      const activePuzzle = await fetchPuzzleChunk(activePuzzleId);
      setPuzzle(activePuzzle);
      
      setState({
        puzzleId: activePuzzle.id,
        date: todayDate,
        guesses: [],
        status: 'playing',
        lastPlayedAt: Date.now(),
        mode: 'daily',
      });
      setIncorrectCount(0);
    } catch (err) {
      console.error("Failed to reset game:", err);
    }
  }, []);

  return { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases };
}
