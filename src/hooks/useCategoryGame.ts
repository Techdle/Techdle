import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, Puzzle, GameMode } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getAllPuzzles, getRandomPuzzleByCategory, getAllAliases } from '../lib/puzzles';
import { isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 6;
const MODE: GameMode = 'category';

export function useCategoryGame(selectedCategory: string) {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Use a specialized storage key for each category so they don't overwrite each other
  const storageKey = `${MODE}-${selectedCategory}` as GameMode;

  useEffect(() => {
    async function loadInitialData() {
      const allAliases = getAllAliases();
      for (let i = allAliases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAliases[i], allAliases[j]] = [allAliases[j], allAliases[i]];
      }
      setAliases(allAliases);

      const savedState = loadGameStateByMode(storageKey);
      
      let initialPuzzle: Puzzle | undefined;
      const initialSeenIds = new Set<string>();

      if (savedState && savedState.status === 'playing') {
        initialPuzzle = getAllPuzzles().find((p) => p.id === savedState.puzzleId);
      }
      
      if (!initialPuzzle) {
        initialPuzzle = getRandomPuzzleByCategory(selectedCategory, initialSeenIds);
        if (initialPuzzle) {
          initialSeenIds.add(initialPuzzle.id);
        }
      } else {
        initialSeenIds.add(initialPuzzle.id);
      }

      setSeenIds(initialSeenIds);
      setPuzzle(initialPuzzle || null);

      if (savedState && savedState.status === 'playing' && initialPuzzle) {
        setState(savedState);
      } else if (initialPuzzle) {
        setState({
          puzzleId: initialPuzzle.id,
          date: getTodayDateString(),
          guesses: [],
          status: 'playing',
          lastPlayedAt: Date.now(),
          mode: MODE,
          consecutiveCorrect: 0,
        });
      }
      setIsLoaded(true);
    }

    loadInitialData();
  }, [selectedCategory, storageKey]);

  useEffect(() => {
    if (state) {
      saveGameStateByMode(storageKey, state);
    }
  }, [state, storageKey]);

  const loadNextPuzzle = useCallback(() => {
    let nextPuzzle = getRandomPuzzleByCategory(selectedCategory, seenIds);
    if (!nextPuzzle) {
      const newSeen = new Set<string>();
      nextPuzzle = getRandomPuzzleByCategory(selectedCategory, newSeen);
      setSeenIds(newSeen);
      if (!nextPuzzle) return;
    } else {
      setSeenIds(prev => new Set(prev).add(nextPuzzle!.id));
    }

    setPuzzle(nextPuzzle);
    setState(prev => ({
      puzzleId: nextPuzzle!.id,
      date: getTodayDateString(),
      guesses: [],
      status: 'playing',
      lastPlayedAt: Date.now(),
      mode: MODE,
      consecutiveCorrect: prev?.consecutiveCorrect || 0,
      fullPuzzle: undefined,
    }));
    setIncorrectCount(0);
  }, [seenIds, selectedCategory]);

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

      const newStreak = correct 
        ? (state.consecutiveCorrect || 0) + 1 
        : (state.consecutiveCorrect || 0);

      const newState: GameState = {
        ...state,
        guesses: newGuesses,
        status: newStatus,
        lastPlayedAt: Date.now(),
        consecutiveCorrect: newStreak,
        ...(newStatus !== 'playing' ? { fullPuzzle: puzzle } : {}),
      };

      setState(newState);
      
      // We don't save overall high scores for category drills yet
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
