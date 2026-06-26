import { GameState, UserStats, ArchiveResult, UserDocument, HistoryEntry } from '../types/game';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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

// ── LocalStorage (anonymous play) ──────────────────────────────────

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

export function saveGameStateMinimal(state: GameState): void {
  if (typeof window === 'undefined') return;
  // Strip fullPuzzle before saving to localStorage (keep localStorage lean).
  // It's re-attached from the server bundle when the user returns.
  const { fullPuzzle, ...minimal } = state;
  localStorage.setItem(GAME_STATE_KEY, encodeData(minimal));
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

export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GAME_STATE_KEY);
  localStorage.removeItem(USER_STATS_KEY);
  localStorage.removeItem(ARCHIVE_RESULTS_KEY);
}

export function validateAndRepairStats(stats: UserStats): UserStats {
  const repaired = { ...INITIAL_USER_STATS, ...stats };

  if (repaired.totalPlayed < 0) repaired.totalPlayed = 0;
  if (repaired.wins < 0) repaired.wins = 0;
  if (repaired.currentStreak < 0) repaired.currentStreak = 0;
  if (repaired.maxStreak < 0) repaired.maxStreak = 0;

  if (repaired.wins > repaired.totalPlayed) repaired.wins = repaired.totalPlayed;

  const guessTotal = Object.values(repaired.guessDistribution).reduce((a, b) => a + b, 0);
  if (guessTotal > repaired.totalPlayed) {
    repaired.guessDistribution = { ...INITIAL_USER_STATS.guessDistribution };
  }

  if (repaired.lastPlayedDate && repaired.totalPlayed === 0) {
    repaired.lastPlayedDate = null;
  }

  return repaired;
}

// ── ArchiveResult ⇄ HistoryEntry converters ───────────────────────

function archiveToHistoryEntry(result: ArchiveResult): HistoryEntry {
  return `${result.puzzleId}:${result.date}:${result.status}:${result.guessesCount}`;
}

function historyEntryToArchive(entry: HistoryEntry): ArchiveResult | null {
  const parts = entry.split(':');
  if (parts.length < 4) return null;
  const [puzzleId, date, status, guessesCountStr] = parts;
  const guessesCount = parseInt(guessesCountStr, 10);
  if (isNaN(guessesCount)) return null;
  if (status !== 'won' && status !== 'lost') return null;
  return { puzzleId, date, status: status as 'won' | 'lost', guessesCount };
}

function archiveHistoryToResults(history: HistoryEntry[]): ArchiveResult[] {
  return history.map(historyEntryToArchive).filter((r): r is ArchiveResult => r !== null);
}

// ── Optimized Firestore: single doc per user ──────────────────────

/**
 * Sync local data to Firestore using the optimized single-doc schema.
 * Called once on auth state change (anonymous sign-in or login).
 */
export async function syncLocalDataToFirestore(uid: string): Promise<void> {
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db!, 'users', uid);
    const userDoc = await getDoc(userRef);

    const localStats = validateAndRepairStats(loadUserStats());
    const localArchive = loadArchiveResults();
    const localHistory = localArchive.map(archiveToHistoryEntry);

    const now = Date.now();

    if (!userDoc.exists()) {
      // First sync: write everything
      const data: UserDocument = {
        stats: localStats,
        history: localHistory,
        updatedAt: now,
      };
      await setDoc(userRef, data);
    } else {
      const cloud = userDoc.data() as UserDocument;
      const cloudStats = cloud.stats || INITIAL_USER_STATS;

      // Merge stats: take whichever has more totalPlayed
      const mergedStats = localStats.totalPlayed >= (cloudStats.totalPlayed || 0)
        ? localStats
        : cloudStats;

      // Merge history: combine both, deduplicate by puzzleId, keep most recent first
      const cloudArchive = archiveHistoryToResults(cloud.history || []);
      const allArchives = [...localArchive];
      for (const cloudResult of cloudArchive) {
        const exists = allArchives.some((r) => r.puzzleId === cloudResult.puzzleId);
        if (!exists) allArchives.push(cloudResult);
      }
      // Sort most recent first
      allArchives.sort((a, b) => b.date.localeCompare(a.date));

      const mergedHistory = allArchives.map(archiveToHistoryEntry);

      const data: UserDocument = {
        stats: mergedStats,
        history: mergedHistory,
        updatedAt: now,
      };
      await setDoc(userRef, data);

      // Sync back to local if cloud was ahead
      if (cloudStats.totalPlayed > localStats.totalPlayed) {
        saveUserStats(cloudStats);
        const syncedArchive = archiveHistoryToResults(mergedHistory);
        localStorage.setItem(ARCHIVE_RESULTS_KEY, encodeData(syncedArchive));
      }
    }
  } catch (err: any) {
    if (err?.code === 'unavailable' || err?.message?.includes('offline')) {
      console.warn("Firestore is unreachable. Progress is saved locally.");
    } else {
      console.error("Failed to sync data to Firestore:", err);
    }
  }
}

/**
 * Sync stats to Firestore (optimized single-doc update).
 * Called once per game completion.
 */
export async function syncStatsToFirestore(uid: string, stats: UserStats): Promise<void> {
  if (!isConfigured || !db) return;
  try {
    const userRef = doc(db!, 'users', uid);
    // Use setDoc with merge so we don't overwrite the history array
    await setDoc(userRef, { stats, updatedAt: Date.now() }, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable') console.error("Failed to sync stats:", err);
  }
}

/**
 * Sync archive history to Firestore.
 * Called after a game completes to persist the result.
 */
export async function syncArchiveToFirestore(uid: string, result: ArchiveResult): Promise<void> {
  if (!isConfigured || !db) return;
  try {
    const userRef = doc(db!, 'users', uid);
    const userDoc = await getDoc(userRef);

    const existingHistory: HistoryEntry[] = userDoc.exists()
      ? (userDoc.data() as UserDocument).history || []
      : [];

    const entry = archiveToHistoryEntry(result);
    const existingIndex = existingHistory.findIndex((h) => h.startsWith(result.puzzleId + ':'));
    let newHistory: HistoryEntry[];
    if (existingIndex >= 0) {
      newHistory = [...existingHistory];
      newHistory[existingIndex] = entry;
    } else {
      newHistory = [entry, ...existingHistory];
    }

    await setDoc(userRef, { history: newHistory, updatedAt: Date.now() }, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable') console.error("Failed to sync archive:", err);
  }
}

/**
 * Load a user's complete data from Firestore (single doc read = one read).
 */
export async function loadUserDocument(uid: string): Promise<UserDocument | null> {
  if (!isConfigured || !db) return null;
  try {
    const userRef = doc(db!, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data() as UserDocument;
  } catch {
    return null;
  }
}
