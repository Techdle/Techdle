import { useState, useEffect, useCallback } from 'react';
import { ClientPuzzle, GameState, Guess } from '../types/game';
import { getTodayDateString, getYesterdayDateString } from '../lib/date';
import { loadGameState, saveGameState, loadUserStats, saveUserStats, syncStateToFirestore, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getClientPuzzleAction, verifyGuessAction, getAllAliasesAction } from '../app/actions';

const MAX_GUESSES = 6;

export function useGame() {
  const { user, isDevMode } = useAuth();
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);

  useEffect(() => {
    async function loadInitialData() {
      const todayDate = getTodayDateString();
      const activePuzzle = await getClientPuzzleAction(todayDate);

      if (!activePuzzle) {
        setIsLoaded(true);
        return;
      }

      setPuzzle(activePuzzle);

      const fetchedAliases = await getAllAliasesAction();
      setAliases(fetchedAliases);

      if (isDevMode) {
        setState({
          puzzleId: activePuzzle.id,
          date: todayDate,
          guesses: [],
          status: 'playing',
          lastPlayedAt: Date.now(),
        });
        setIsLoaded(true);
        return;
      }

      const savedState = loadGameState();

      if (savedState && savedState.puzzleId === activePuzzle.id && savedState.date === todayDate) {
        if (savedState.status !== 'playing' && !savedState.fullPuzzle) {
          const lastGuess = savedState.guesses[savedState.guesses.length - 1];
          if (lastGuess) {
            const result = await verifyGuessAction(savedState.puzzleId, lastGuess.text, savedState.guesses.length - 1, MAX_GUESSES);
            savedState.fullPuzzle = result.fullPuzzle;
          }
        }
        setState(savedState);
      } else {
        setState({
          puzzleId: activePuzzle.id,
          date: todayDate,
          guesses: [],
          status: 'playing',
          lastPlayedAt: Date.now(),
        });
      }
      setIsLoaded(true);
    }
    
    loadInitialData();
  }, [isDevMode]);

  // Sync state to local storage when it changes
  useEffect(() => {
    if (state) {
       saveGameState(state);
       if (user && !isDevMode) {
         syncStateToFirestore(user.uid, state);
       }
    }
  }, [state, user, isDevMode]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await verifyGuessAction(state.puzzleId, guessText, state.guesses.length, MAX_GUESSES);

      const newGuess: Guess = { text: guessText, status: result.status };
      const newGuesses = [...state.guesses, newGuess];

      if (!result.correct) {
        setIncorrectCount(c => c + 1);
      }

      let newStatus: 'playing' | 'won' | 'lost' = state.status;
      if (result.isGameOver) {
        newStatus = result.correct ? 'won' : 'lost';
      }

      const newState: GameState = {
        ...state,
        guesses: newGuesses,
        status: newStatus,
        lastPlayedAt: Date.now(),
        ...(result.fullPuzzle && { fullPuzzle: result.fullPuzzle }),
      };

      setState(newState);

      if (newStatus !== 'playing' && !isDevMode) {
      const stats = loadUserStats();
      const today = getTodayDateString();

      if (stats.lastPlayedDate !== today) {
        const oldLastPlayed = stats.lastPlayedDate;
        stats.totalPlayed += 1;
        stats.lastPlayedDate = today;

        if (newStatus === 'won') {
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
          const guessCount = newGuesses.length as 1|2|3|4|5|6;
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
    }
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isDevMode, isSubmitting]);

  const resetGame = useCallback(async () => {
    const todayDate = getTodayDateString();
    const activePuzzle = await getClientPuzzleAction(todayDate);
    if (!activePuzzle) return;
    setPuzzle(activePuzzle);
    setState({
      puzzleId: activePuzzle.id,
      date: todayDate,
      guesses: [],
      status: 'playing',
      lastPlayedAt: Date.now(),
    });
    setIncorrectCount(0);
  }, []);

  return { puzzle, state, isLoaded, submitGuess, resetGame, MAX_GUESSES, incorrectCount, isSubmitting, aliases };
}
