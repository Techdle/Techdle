import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, ClientPuzzle, GameMode } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode } from '../lib/storage';
import { fetchDictionary, fetchPuzzleChunk, getRandomPuzzleIdByCategory } from '../lib/puzzles';
import { decodeClientPuzzle, isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 6;
const MODE: GameMode = 'category';

export function useCategoryGame(selectedCategory: string) {
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  const storageKey = `${MODE}-${selectedCategory}` as GameMode;

  useEffect(() => {
    let mounted = true;

    async function loadInitialData() {
      try {
        const dict = await fetchDictionary();
        if (!mounted) return;
        setAliases(dict);

        const savedState = loadGameStateByMode(storageKey);
        
        let initialPuzzleId: string | undefined;
        let initialSeenIds = new Set<string>();

        if (savedState && savedState.status === 'playing') {
          initialPuzzleId = savedState.puzzleId;
        }
        
        if (!initialPuzzleId) {
          initialPuzzleId = await getRandomPuzzleIdByCategory(selectedCategory, initialSeenIds);
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
        console.error("Failed to load category game:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
  }, [selectedCategory, storageKey]);

  useEffect(() => {
    if (state) {
      saveGameStateByMode(storageKey, state);
    }
  }, [state, storageKey]);

  const loadNextPuzzle = useCallback(async () => {
    try {
      let nextPuzzleId = await getRandomPuzzleIdByCategory(selectedCategory, seenIds);
      let newSeen = new Set(seenIds);

      if (!nextPuzzleId) {
        newSeen = new Set<string>();
        nextPuzzleId = await getRandomPuzzleIdByCategory(selectedCategory, newSeen);
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
        consecutiveCorrect: prev?.consecutiveCorrect || 0,
        fullPuzzle: undefined,
      }));
      setIncorrectCount(0);
    } catch (err) {
      console.error("Failed to load next category puzzle:", err);
    }
  }, [seenIds, selectedCategory]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const isGameOver = state.guesses.length + 1 >= MAX_GUESSES;

      const fullPuzzle = decodeClientPuzzle(puzzle);
      const correct = isGuessCorrect(guessText, fullPuzzle);
      
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

      const newStreak = correct 
        ? (state.consecutiveCorrect || 0) + 1 
        : (state.consecutiveCorrect || 0);

      const newState: GameState = {
        ...state,
        guesses: newGuesses,
        status: newStatus,
        lastPlayedAt: Date.now(),
        consecutiveCorrect: newStreak,
        ...(newStatus !== 'playing' && fullPuzzle ? { fullPuzzle } : {}),
      };

      setState(newState);
    } catch (err) {
      console.error("Failed to submit guess:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, isSubmitting]);

  return { 
    puzzle, 
    state, 
    isLoaded, 
    submitGuess, 
    loadNextPuzzle,
    MAX_GUESSES, 
    incorrectCount, 
    isSubmitting, 
    aliases 
  };
}
