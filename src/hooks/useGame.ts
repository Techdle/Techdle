import { useState, useEffect, useCallback } from 'react';
import { ClientPuzzle, GameState, Guess } from '../types/game';
import { getTodayDateString, getYesterdayDateString } from '../lib/date';
import { loadGameState, saveGameState, loadUserStats, saveUserStats, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getAllPuzzles } from '../lib/puzzles';
import { getTodayClientPuzzle, DATA_VERSION } from '../lib/client-puzzles';
import { isGuessCorrectClient, getTodayDateSeed } from '../lib/utils';

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
      const activePuzzle = getTodayClientPuzzle();

      if (!activePuzzle) {
        setIsLoaded(true);
        return;
      }

      setPuzzle(activePuzzle);

      // Load aliases from the full puzzle data (still needed for typeahead)
      const allPuzzles = getAllPuzzles();
      const aliasSet = new Set<string>();
      allPuzzles.forEach((p) => {
        aliasSet.add(p.answer.toLowerCase());
        (p.aliases || []).forEach((a) => aliasSet.add(a.toLowerCase()));
      });
      // Shuffle for UI
      const allAliases = Array.from(aliasSet);
      for (let i = allAliases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAliases[i], allAliases[j]] = [allAliases[j], allAliases[i]];
      }
      setAliases(allAliases);

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

      // Check if puzzle data has been regenerated (version bump invalidates today's state)
      const versionKey = 'techdle_puzzle_version';
      let savedState = loadGameState();
      if (savedState && typeof window !== 'undefined') {
        const knownVersion = localStorage.getItem(versionKey);
        const currentVersion = DATA_VERSION ?? 1;
        if (!knownVersion || Number(knownVersion) < currentVersion) {
          // Puzzle data has been updated — reset today's game and stats
          savedState = null;
          localStorage.removeItem('techdle_game_state');
          localStorage.removeItem('techdle_user_stats');
        }
      }
      // Save the current version so future comparisons work
      if (typeof window !== 'undefined' && DATA_VERSION !== undefined) {
        localStorage.setItem(versionKey, String(DATA_VERSION));
      }

      if (savedState && savedState.puzzleId === activePuzzle.id && savedState.date === todayDate) {
        // Restore fullPuzzle from the server data if game was over
        if (savedState.status !== 'playing' && !savedState.fullPuzzle) {
          const fullPuzzle = allPuzzles.find((p) => p.id === savedState.puzzleId);
          if (fullPuzzle) {
            savedState.fullPuzzle = fullPuzzle;
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

  // Sync state to local storage when it changes (without fullPuzzle to keep localStorage lean)
  useEffect(() => {
    if (state) {
      saveGameState(state);
    }
  }, [state]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const dateSeed = getTodayDateSeed();
      const allPuzzles = getAllPuzzles();
      const fullPuzzle = allPuzzles.find((p) => p.id === state.puzzleId);

      // Client-side validation using hash comparison
      const correct = fullPuzzle
        ? await isGuessCorrectClient(guessText, fullPuzzle, dateSeed, puzzle.answerHash)
        : guessText.toLowerCase().replace(/[^a-z0-9]/g, '') === puzzle.answerHash;

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
        // Attach full puzzle on game over so ResolutionTicket can render
        ...(newStatus !== 'playing' && fullPuzzle ? { fullPuzzle } : {}),
      };

      setState(newState);

      // Update stats on game completion (non-dev mode)
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
            const guessCount = newGuesses.length as 1 | 2 | 3 | 4 | 5 | 6;
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
    const activePuzzle = getTodayClientPuzzle();
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
