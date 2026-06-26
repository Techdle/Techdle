import { GameState, UserStats, ArchiveResult } from '../types/game';
import { doc, getDoc, setDoc, writeBatch } from 'firebase/firestore';
import { db, isConfigured } from './firebase';

const GAME_STATE_KEY = 'techdle_game_state';
const USER_STATS_KEY = 'techdle_user_stats';
const ARCHIVE_RESULTS_KEY = 'techdle_archive_results';

function encodeData(data: any): string {
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

function decodeData(dataString: string): any {
  try {
    if (dataString.startsWith('{') || dataString.startsWith('[')) {
      return JSON.parse(dataString);
    }
    return JSON.parse(decodeURIComponent(atob(dataString)));
  } catch (e) {
    return null;
  }
}

export const INITIAL_USER_STATS: UserStats = {
  totalPlayed: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  lastPlayedDate: null,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, loss: 0 },
};

export function loadGameState(): GameState | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(GAME_STATE_KEY);
  if (!data) return null;
  const parsed = decodeData(data);
  return parsed || null;
}

export function saveGameState(state: GameState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GAME_STATE_KEY, encodeData(state));
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_USER_STATS;
  const data = localStorage.getItem(USER_STATS_KEY);
  if (!data) return INITIAL_USER_STATS;
  const parsed = decodeData(data);
  return parsed ? { ...INITIAL_USER_STATS, ...parsed } : INITIAL_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_STATS_KEY, encodeData(stats));
}

export function loadArchiveResults(): ArchiveResult[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ARCHIVE_RESULTS_KEY);
  if (!data) return [];
  const parsed = decodeData(data);
  return parsed || [];
}

export function saveArchiveResult(result: ArchiveResult): void {
  if (typeof window === 'undefined') return;
  const results = loadArchiveResults();
  const existingIndex = results.findIndex((r) => r.puzzleId === result.puzzleId);
  if (existingIndex >= 0) {
    results[existingIndex] = result;
  } else {
    results.push(result);
  }
  localStorage.setItem(ARCHIVE_RESULTS_KEY, encodeData(results));
}

/**
 * Clear all locally stored game data (stats, game state, archive results).
 */
export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GAME_STATE_KEY);
  localStorage.removeItem(USER_STATS_KEY);
  localStorage.removeItem(ARCHIVE_RESULTS_KEY);
}

/**
 * Validate stored user stats and repair any inconsistencies.
 * Returns cleaned stats.
 */
export function validateAndRepairStats(stats: UserStats): UserStats {
  const repaired = { ...INITIAL_USER_STATS, ...stats };

  // Clamp to sane ranges
  if (repaired.totalPlayed < 0) repaired.totalPlayed = 0;
  if (repaired.wins < 0) repaired.wins = 0;
  if (repaired.currentStreak < 0) repaired.currentStreak = 0;
  if (repaired.maxStreak < 0) repaired.maxStreak = 0;

  // Wins cannot exceed totalPlayed
  if (repaired.wins > repaired.totalPlayed) repaired.wins = repaired.totalPlayed;

  // Guess distribution totals should match wins + losses
  const guessTotal = Object.values(repaired.guessDistribution).reduce((a, b) => a + b, 0);
  if (guessTotal > repaired.totalPlayed) {
    // Scale down proportionally or just reset individual entries
    repaired.guessDistribution = { ...INITIAL_USER_STATS.guessDistribution };
  }

  // If there's a lastPlayedDate but totalPlayed is 0, it's inconsistent
  if (repaired.lastPlayedDate && repaired.totalPlayed === 0) {
    repaired.lastPlayedDate = null;
  }

  return repaired;
}

// Phase 2: Firebase Sync Functions
export async function syncLocalDataToFirestore(uid: string): Promise<void> {
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db!, 'users', uid);
    const userDoc = await getDoc(userRef);

    const localStats = validateAndRepairStats(loadUserStats());
    const localGameState = loadGameState();
    const localArchive = loadArchiveResults();

    const batch = writeBatch(db!);

    if (!userDoc.exists()) {
      batch.set(userRef, localStats);
    } else {
      const cloudStats = userDoc.data() as UserStats;
      if (localStats.totalPlayed > (cloudStats.totalPlayed || 0)) {
         batch.set(userRef, localStats, { merge: true });
      } else if (localStats.totalPlayed < (cloudStats.totalPlayed || 0)) {
         saveUserStats(cloudStats);
      }
    }

    if (localGameState) {
      const stateRef = doc(db!, 'users', uid, 'results', localGameState.puzzleId);
      batch.set(stateRef, localGameState, { merge: true });
    }

    if (localArchive.length > 0) {
      localArchive.forEach(res => {
        const archRef = doc(db!, 'users', uid, 'archiveResults', res.puzzleId);
        batch.set(archRef, res, { merge: true });
      });
    }

    await batch.commit();
  } catch (err: any) {
    if (err?.code === 'unavailable' || err?.message?.includes('offline')) {
      console.warn("Firestore is unreachable (offline or blocked by extension). Progress is saved locally.");
    } else {
      console.error("Failed to sync data to Firestore:", err);
    }
  }
}

export async function syncStateToFirestore(uid: string, state: GameState): Promise<void> {
  if (!isConfigured || !db) return;
  try {
    const stateRef = doc(db!, 'users', uid, 'results', state.puzzleId);
    await setDoc(stateRef, state, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable') console.error("Failed to sync state:", err);
  }
}

export async function syncStatsToFirestore(uid: string, stats: UserStats): Promise<void> {
  if (!isConfigured || !db) return;
  try {
    const userRef = doc(db!, 'users', uid);
    await setDoc(userRef, stats, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable') console.error("Failed to sync stats:", err);
  }
}
