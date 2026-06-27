import { useState, useEffect, useCallback } from 'react';
import { GameState, Guess, Puzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode, loadEndlessHighScore, saveEndlessHighScore, syncEndlessHighScoreToFirestore } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getAllPuzzles, getRandomPuzzle, getAllAliases } from '../lib/puzzles';
import { isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 6;
const MODE = 'endless';

export function useEndlessGame() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Initialization
  useEffect(() => {
    async function loadInitialData() {
      const allAliases = getAllAliases();
      // Shuffle aliases for UI
      for (let i = allAliases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAliases[i], allAliases[j]] = [allAliases[j], allAliases[i]];
      }
      setAliases(allAliases);

      const savedState = loadGameStateByMode(MODE);
      
      let initialPuzzle: Puzzle | undefined;
      let initialSeenIds = new Set<string>();

      if (savedState && savedState.status === 'playing') {
        initialPuzzle = getAllPuzzles().find((p) => p.id === savedState.puzzleId);
      }
      
      if (!initialPuzzle) {
        initialPuzzle = getRandomPuzzle(initialSeenIds);
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
  }, []);

  // Sync state
  useEffect(() => {
    if (state) {
      saveGameStateByMode(MODE, state);
    }
  }, [state]);

  const loadNextPuzzle = useCallback(() => {
    let nextPuzzle = getRandomPuzzle(seenIds);
    if (!nextPuzzle) {
      // reshuffle if exhausted
      const newSeen = new Set<string>();
      nextPuzzle = getRandomPuzzle(newSeen);
      setSeenIds(newSeen);
      if (!nextPuzzle) return; // Should never happen unless DB is empty
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
  }, [seenIds]);

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

      if (newStatus === 'lost') {
        const highScore = loadEndlessHighScore();
        if (newStreak > highScore) {
          saveEndlessHighScore(newStreak);
          if (user) {
            syncEndlessHighScoreToFirestore(user.uid, newStreak);
          }
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, user, isSubmitting]);

  const resetGame = useCallback(async () => {
    const newSeen = new Set<string>();
    const initialPuzzle = getRandomPuzzle(newSeen);
    if (!initialPuzzle) return;
    
    newSeen.add(initialPuzzle.id);
    setSeenIds(newSeen);
    setPuzzle(initialPuzzle);
    
    setState({
      puzzleId: initialPuzzle.id,
      date: getTodayDateString(),
      guesses: [],
      status: 'playing',
      lastPlayedAt: Date.now(),
      mode: MODE,
      consecutiveCorrect: 0,
    });
    setIncorrectCount(0);
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
