export interface Puzzle {
  id: string;
  category: string;
  difficulty: string;
  clues: string[];
  answer: string;
  aliases: string[];
  explanation: string;
  fixSteps: string[];
  symptom?: string;
}

export interface ClientPuzzle {
  id: string;
  number: number;
  category: string;
  difficulty: string;
  clues: string[];
}

export type GuessStatus = 'correct' | 'incorrect';

export interface Guess {
  text: string;
  status: GuessStatus;
}

export interface GameState {
  puzzleId: string;
  date: string;
  guesses: Guess[];
  status: 'playing' | 'won' | 'lost';
  lastPlayedAt: number;
  fullPuzzle?: Puzzle;
}

export interface UserStats {
  totalPlayed: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedDate: string | null;
  guessDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
    loss: number;
  };
}

export interface ArchiveResult {
  puzzleId: string;
  date: string;
  status: 'won' | 'lost';
  guessesCount: number;
}
