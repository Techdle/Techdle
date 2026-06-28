import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, ClientPuzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode, loadEndlessHighScore, saveEndlessHighScore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { fetchDictionary, fetchPuzzleChunk, getRandomPuzzleId } from '../lib/puzzles';
import { decodeClientPuzzle, isGuessCorrect, processGuessLogic } from '../lib/utils';

const MAX_GUESSES = 6;
const MODE = 'endless';

export function useEndlessGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Initialization
  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const dict = await fetchDictionary();
        if (!mounted) return;
        setAliases(dict);

        const savedState = loadGameStateByMode(MODE);
        
        let initialPuzzleId: string | undefined;
        const initialSeenIds = new Set<string>();

        if (savedState && savedState.status === 'playing') {
          initialPuzzleId = savedState.puzzleId;
        }
        
        if (!initialPuzzleId) {
          initialPuzzleId = await getRandomPuzzleId(initialSeenIds);
          if (initialPuzzleId) {
            initialSeenIds.add(initialPuzzleId);
          }
        } else {
          initialSeenIds.add(initialPuzzleId);
        }

        if (!mounted) return;
        setSeenIds(initialSeenIds);

        if (initialPuzzleId) {
          const initialPuzzleChunk = await fetchPuzzleChunk(initialPuzzleId);
          if (!mounted) return;
          setPuzzle(initialPuzzleChunk);

          if (savedState && savedState.status === 'playing') {
            setState(savedState);
          } else if (savedState && savedState.status !== 'playing' && !savedState.fullPuzzle) {
            savedState.fullPuzzle = decodeClientPuzzle(initialPuzzleChunk);
            setState({ ...savedState });
          } else {
            setState({
              puzzleId: initialPuzzleChunk.id,
              date: getTodayDateString(),
              guesses: [],
              status: 'playing',
              lastPlayedAt: Date.now(),
              mode: MODE,
              consecutiveCorrect: 0,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load endless game:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, []);

  // Sync state
  useEffect(() => {
    if (state) {
      saveGameStateByMode(MODE, state);
    }
  }, [state]);

  const loadNextPuzzle = useCallback(async () => {
    try {
      let nextPuzzleId = await getRandomPuzzleId(seenIds);
      let newSeen = new Set(seenIds);

      if (!nextPuzzleId) {
        // reshuffle if exhausted
        newSeen = new Set<string>();
        nextPuzzleId = await getRandomPuzzleId(newSeen);
        if (!nextPuzzleId) return; // Should never happen unless DB is empty
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
        consecutiveCorrect: prev?.consecutiveCorrect || 0,
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

      const { newState, isCorrect } = processGuessLogic(state, puzzle, guessText, MAX_GUESSES);

      if (!isCorrect) {
        setIncorrectCount((c) => c + 1);
      }

      newState.consecutiveCorrect = isCorrect 
        ? (state.consecutiveCorrect || 0) + 1 
        : (state.consecutiveCorrect || 0);

      setState(newState);

      if (newState.status === 'lost') {
        const highScore = loadEndlessHighScore();
        const newStreak = newState.consecutiveCorrect || 0;
        if (newStreak > highScore) {
          saveEndlessHighScore(newStreak);
        }
      }
    } catch (err) {
      console.error("Failed to submit guess:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isSubmitting]);

  const resetGame = useCallback(async () => {
    try {
      const newSeen = new Set<string>();
      const initialPuzzleId = await getRandomPuzzleId(newSeen);
      if (!initialPuzzleId) return;
      
      newSeen.add(initialPuzzleId);
      setSeenIds(newSeen);

      const initialPuzzleChunk = await fetchPuzzleChunk(initialPuzzleId);
      setPuzzle(initialPuzzleChunk);
      
      setState({
        puzzleId: initialPuzzleId,
        date: getTodayDateString(),
        guesses: [],
        status: 'playing',
        lastPlayedAt: Date.now(),
        mode: MODE,
        consecutiveCorrect: 0,
      });
      setIncorrectCount(0);
    } catch (err) {
      console.error("Failed to reset game:", err);
    }
  }, []);

  return { 
    puzzle, 
    state, 
    isLoaded, 
    submitGuess, 
    resetGame, 
    loadNextPuzzle,
    MAX_GUESSES, 
    incorrectCount, 
    isSubmitting, 
    aliases 
  };
}
