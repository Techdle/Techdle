import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, ClientPuzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode, loadUserStats, saveUserStats, syncStatsToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getRandomP1PuzzleId, fetchPuzzleChunk, fetchDictionary } from '../lib/puzzles';

const MAX_GUESSES = 3;
const MODE = 'p1-outage';

export function useP1OutageGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<(ClientPuzzle & { rawLogs?: string[] }) | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const dict = await fetchDictionary();
        if (!mounted) return;
        setAliases(dict);

        const savedState = loadGameStateByMode(MODE);
        
        let initialPuzzleId: string | undefined;
        let initialSeenIds = new Set<string>();

        if (savedState && savedState.status === 'playing') {
          initialPuzzleId = savedState.puzzleId;
        }
        
        if (!initialPuzzleId) {
          initialPuzzleId = await getRandomP1PuzzleId(initialSeenIds);
          if (initialPuzzleId) {
            initialSeenIds.add(initialPuzzleId);
          }
        } else {
          initialSeenIds.add(initialPuzzleId);
        }

        if (!mounted) return;
        setSeenIds(initialSeenIds);

        if (initialPuzzleId) {
          const activePuzzle = await fetchPuzzleChunk(initialPuzzleId);
          if (!mounted) return;
          setPuzzle(activePuzzle);

          if (savedState && savedState.status === 'playing') {
            setState(savedState);
            setIncorrectCount(savedState.guesses.filter(g => g.status === 'incorrect').length);
          } else {
            setState({
              puzzleId: initialPuzzleId,
              date: getTodayDateString(),
              guesses: [],
              status: 'playing',
              lastPlayedAt: Date.now(),
              mode: MODE,
            });
            setIncorrectCount(0);
          }
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

  const loadNextPuzzle = useCallback(async () => {
    try {
      let nextPuzzleId = await getRandomP1PuzzleId(seenIds);
      let newSeen = new Set(seenIds);

      if (!nextPuzzleId) {
        newSeen = new Set<string>();
        nextPuzzleId = await getRandomP1PuzzleId(newSeen);
        if (!nextPuzzleId) return;
      }
      
      newSeen.add(nextPuzzleId);
      setSeenIds(newSeen);

      const nextPuzzleChunk = await fetchPuzzleChunk(nextPuzzleId);
      setPuzzle(nextPuzzleChunk);

      setState(prev => ({
        puzzleId: nextPuzzleId!,
        date: getTodayDateString(),
        guesses: [],
        status: 'playing',
        lastPlayedAt: Date.now(),
        mode: MODE,
        fullPuzzle: undefined,
      }));
      setIncorrectCount(0);
    } catch (err) {
      console.error("Failed to load next puzzle:", err);
    }
  }, [seenIds]);

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
    await loadNextPuzzle();
  }, [loadNextPuzzle]);

  return { puzzle, state, isLoaded, submitGuess, resetGame, loadNextPuzzle, MAX_GUESSES, incorrectCount, isSubmitting, aliases };
}
