import { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, Guess, ClientPuzzle } from '../types/game';
import { getTodayDateString } from '../lib/date';
import { loadGameStateByMode, saveGameStateByMode } from '../lib/storage';
import { useAuth } from '../components/AuthProvider';
import { getRandomPuzzleId, fetchDictionary, fetchPuzzleChunk } from '../lib/puzzles';

const MAX_GUESSES = 6;
const MODE = 'sla-time-attack';
const INITIAL_TIME_MS = 60000;
const TIME_BONUS_MS = 15000;
const TIME_PENALTY_MS = 5000;

export function useSLATimeAttack() {
  const { user } = useAuth();
  const [puzzle, setPuzzle] = useState<ClientPuzzle | null>(null);
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
          if ((savedState.timeRemaining || 0) > 0) {
            setTimeRemaining(savedState.timeRemaining!);
            initialPuzzleId = await getRandomPuzzleId(initialSeenIds);
          } else {
            savedState.status = 'lost';
          }
        }
        
        if (!initialPuzzleId && (!savedState || savedState.status !== 'playing')) {
          initialPuzzleId = await getRandomPuzzleId(initialSeenIds);
        }

        if (initialPuzzleId) {
          initialSeenIds.add(initialPuzzleId);
          if (!mounted) return;
          setSeenIds(initialSeenIds);
          
          const initialPuzzleChunk = await fetchPuzzleChunk(initialPuzzleId);
          if (!mounted) return;
          setPuzzle(initialPuzzleChunk);
          
          if (!savedState || savedState.status !== 'playing') {
            setState({
              puzzleId: initialPuzzleChunk.id,
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
      } catch (err) {
        console.error("Failed to load SLA time attack:", err);
      } finally {
        if (mounted) setIsLoaded(true);
      }
    }

    loadInitialData();
    return () => { mounted = false; };
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
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setTimeRemaining(prev => {
        const nextTime = Math.max(0, prev - delta);
        if (nextTime === 0) {
          setState(s => s ? { 
            ...s, 
            status: 'lost', 
            timeRemaining: 0,
          } : s);
          
          // When time runs out, we need the full puzzle to show the answer!
          // We fetch it asynchronously so the timer doesn't block
          if (puzzle) {
            fetch('/api/guess', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ puzzleId: puzzle.id, guess: 'timeout', isGameOver: true }),
            }).then(res => res.json()).then(data => {
              if (data.fullPuzzle) {
                setState(s => s ? { ...s, fullPuzzle: data.fullPuzzle } : s);
              }
            });
          }
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
      const res = await fetch('/api/guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId: state.puzzleId, guess: guessText, isGameOver: false }),
      });
      const data = await res.json();
      const correct = data.correct === true;

      const status: 'correct' | 'incorrect' = correct ? 'correct' : 'incorrect';
      const newGuess: Guess = { text: guessText, status };
      const newGuesses = [...state.guesses, newGuess];

      if (!correct) {
        setIncorrectCount((c) => c + 1);
        setTimeRemaining(prev => Math.max(0, prev - TIME_PENALTY_MS));
      }

      if (correct) {
        let nextPuzzleId = await getRandomPuzzleId(seenIds);
        let newSeen = new Set(seenIds);
        
        if (!nextPuzzleId) {
          newSeen = new Set<string>();
          nextPuzzleId = await getRandomPuzzleId(newSeen);
        }
        if (nextPuzzleId) {
          newSeen.add(nextPuzzleId);
          setSeenIds(newSeen);
          const nextPuzzleChunk = await fetchPuzzleChunk(nextPuzzleId);
          setPuzzle(nextPuzzleChunk);
          
          setTimeRemaining(prev => Math.min(INITIAL_TIME_MS, prev + TIME_BONUS_MS));
          setState({
            ...state,
            puzzleId: nextPuzzleId,
            guesses: [],
            score: (state.score || 0) + 1,
          });
          setIncorrectCount(0);
        }
      } else if (newGuesses.length >= MAX_GUESSES) {
        setTimeRemaining(prev => Math.max(0, prev - TIME_PENALTY_MS)); 
        
        let nextPuzzleId = await getRandomPuzzleId(seenIds);
        let newSeen = new Set(seenIds);
        
        if (!nextPuzzleId) {
          newSeen = new Set<string>();
          nextPuzzleId = await getRandomPuzzleId(newSeen);
        }
        if (nextPuzzleId) {
          newSeen.add(nextPuzzleId);
          setSeenIds(newSeen);
          const nextPuzzleChunk = await fetchPuzzleChunk(nextPuzzleId);
          setPuzzle(nextPuzzleChunk);
          
          setState({
            ...state,
            puzzleId: nextPuzzleId,
            guesses: [],
          });
          setIncorrectCount(0);
        }
      } else {
        setState({
          ...state,
          guesses: newGuesses,
        });
      }

    } catch (err) {
      console.error("Failed to submit guess SLA:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [state, puzzle, isSubmitting, timeRemaining, seenIds]);

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
        score: 0,
        timeRemaining: INITIAL_TIME_MS,
      });
      setTimeRemaining(INITIAL_TIME_MS);
      setIncorrectCount(0);
    } catch (err) {
      console.error("Failed to reset SLA game:", err);
    }
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
