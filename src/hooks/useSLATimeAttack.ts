import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Guess, Puzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getRandomPuzzle, getAllAliases } from '../lib/puzzles';
import { isGuessCorrect } from '../lib/utils';

const MAX_GUESSES = 6;
const MODE = 'sla-time-attack';
const INITIAL_TIME_MS = 60000;
const TIME_BONUS_MS = 15000;
const TIME_PENALTY_MS = 5000;

export function useSLATimeAttack() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [state, setState] = useState<GameState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aliases, setAliases] = useState<string[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(INITIAL_TIME_MS);
  const lastTickRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialization
  useEffect(() => {
    async function loadInitialData() {
      const allAliases = getAllAliases();
      for (let i = allAliases.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [allAliases[i], allAliases[j]] = [allAliases[j], allAliases[i]];
      }
      setAliases(allAliases);

      const savedState = loadGameStateByMode(MODE);
      let initialPuzzle: Puzzle | undefined;
      const initialSeenIds = new Set<string>();

      if (savedState && savedState.status === 'playing') {
        // SLA mode shouldn't really resume mid-game due to the timer, 
        // but we can try if there was time remaining
        if ((savedState.timeRemaining || 0) > 0) {
          setTimeRemaining(savedState.timeRemaining!);
          initialPuzzle = getRandomPuzzle(initialSeenIds); // just get a new one anyway
        } else {
          savedState.status = 'lost';
        }
      }
      
      if (!initialPuzzle && (!savedState || savedState.status !== 'playing')) {
        initialPuzzle = getRandomPuzzle(initialSeenIds);
      }

      if (initialPuzzle) {
        initialSeenIds.add(initialPuzzle.id);
        setSeenIds(initialSeenIds);
        setPuzzle(initialPuzzle);
        
        if (!savedState || savedState.status !== 'playing') {
          setState({
            puzzleId: initialPuzzle.id,
            date: getTodayDateString(),
            guesses: [],
            status: 'playing',
            lastPlayedAt: Date.now(),
            mode: MODE,
            score: 0,
            timeRemaining: INITIAL_TIME_MS,
          });
          setTimeRemaining(INITIAL_TIME_MS);
        } else {
          setState(savedState);
        }
      }
      setIsLoaded(true);
    }

    loadInitialData();
  }, []);

  // Timer Logic
  useEffect(() => {
    if (!state || state.status !== 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    lastTickRef.current = Date.now();

    const tick = () => {
      if (document.hidden) {
        // Paused while hidden, just update lastTickRef to prevent massive jump
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setTimeRemaining(prev => {
        const nextTime = Math.max(0, prev - delta);
        if (nextTime === 0) {
          // Time up! Game over.
          setState(s => s ? { 
            ...s, 
            status: 'lost', 
            timeRemaining: 0,
            fullPuzzle: puzzle || undefined
          } : s);
        }
        return nextTime;
      });
    };

    timerRef.current = setInterval(tick, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state?.status, puzzle]);

  // Sync state
  useEffect(() => {
    if (state) {
      saveGameStateByMode(MODE, { ...state, timeRemaining });
    }
  }, [state, timeRemaining]);

  const submitGuess = useCallback(async (guessText: string) => {
    if (!state || !puzzle || state.status !== 'playing' || isSubmitting || timeRemaining <= 0) return;

    setIsSubmitting(true);
    try {
      const correct = isGuessCorrect(guessText, puzzle);

      const status: 'correct' | 'incorrect' = correct ? 'correct' : 'incorrect';
      const newGuess: Guess = { text: guessText, status };
      const newGuesses = [...state.guesses, newGuess];

      if (!correct) {
        setIncorrectCount((c) => c + 1);
        setTimeRemaining(prev => Math.max(0, prev - TIME_PENALTY_MS));
      }

      if (correct) {
        // Move to next puzzle immediately
        let nextPuzzle = getRandomPuzzle(seenIds);
        if (!nextPuzzle) {
          const newSeen = new Set<string>();
          nextPuzzle = getRandomPuzzle(newSeen);
          setSeenIds(newSeen);
        } else {
          setSeenIds(prev => new Set(prev).add(nextPuzzle!.id));
        }

        setTimeRemaining(prev => Math.min(INITIAL_TIME_MS, prev + TIME_BONUS_MS));
        setPuzzle(nextPuzzle || null);
        
        setState({
          ...state,
          puzzleId: nextPuzzle?.id || '',
          guesses: [],
          score: (state.score || 0) + 1,
        });
        setIncorrectCount(0);
      } else if (newGuesses.length >= MAX_GUESSES) {
        // Ran out of guesses for this puzzle
        setTimeRemaining(prev => Math.max(0, prev - TIME_PENALTY_MS)); // extra penalty?
        
        // Let's just move them to the next puzzle but not increment score
        let nextPuzzle = getRandomPuzzle(seenIds);
        if (!nextPuzzle) {
          const newSeen = new Set<string>();
          nextPuzzle = getRandomPuzzle(newSeen);
          setSeenIds(newSeen);
        } else {
          setSeenIds(prev => new Set(prev).add(nextPuzzle!.id));
        }

        setPuzzle(nextPuzzle || null);
        setState({
          ...state,
          puzzleId: nextPuzzle?.id || '',
          guesses: [],
        });
        setIncorrectCount(0);
      } else {
        setState({
          ...state,
          guesses: newGuesses,
        });
      }

    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, isSubmitting, timeRemaining, seenIds]);

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
      score: 0,
      timeRemaining: INITIAL_TIME_MS,
    });
    setTimeRemaining(INITIAL_TIME_MS);
    setIncorrectCount(0);
  }, []);

  return { 
    puzzle, 
    state, 
    isLoaded, 
    submitGuess, 
    resetGame, 
    MAX_GUESSES, 
    incorrectCount, 
    isSubmitting, 
    aliases,
    timeRemaining
  };
}
