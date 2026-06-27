export interface Puzzle {
  id: string;
  category: string;
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
  clues: string[];
  /** SHA-256 hash of (dateSeed + answer), for client-side validation */
  answerHash: string;
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
  /** The Puzzle object returned after game ends (stored for ResolutionTicket).
   *  Only populated when game is over — answers remain hidden during play. */
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

/**
 * Compact format for a single game result in the user document's history array.
 * This avoids a separate subcollection read for the archive/dictionary page.
 *
 * Stored as a string to keep the doc small:
 *   `${puzzleId}:${date}:${status}:${guessCount}`
 *
 * Example: "hdd-failure:2026-06-26:won:3"
 * Max ~50 chars per entry. 365 entries = ~18KB. Well under Firestore's 1MB/doc limit.
 */
export type HistoryEntry = string;

/**
 * The single Firestore document per user.
 * One read = everything. No subcollections.
 */
export interface UserDocument {
  /** User statistics (aggregated) */
  stats: UserStats;
  /** Compact history of completed games, most recent first */
  history: HistoryEntry[];
  /** Unix timestamp of last update */
  updatedAt: number;
}

// Keep the original ArchiveResult for backward compatibility
export interface ArchiveResult {
  puzzleId: string;
  date: string;
  status: 'won' | 'lost';
  guessesCount: number;
}
