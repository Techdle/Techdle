import { GameState, UserStats, ArchiveResult, UserDocument, HistoryEntry, GameMode } from '../types/game';
import { getTodayDateString, getYesterdayDateString } from './date';

const GAME_STATE_KEY = 'techdle_game_state';
const USER_STATS_KEY = 'techdle_user_stats';
const ARCHIVE_RESULTS_KEY = 'techdle_archive_results';
const ENDLESS_HIGH_SCORE_KEY = 'techdle_endless_high_score';

const STATE_KEYS: Record<GameMode, string> = {
  daily: 'techdle_state',
  endless: 'techdle_state_endless',
  'sla-time-attack': 'techdle_state_sla-time-attack',
  'p1-outage': 'techdle_state_p1-outage',
  'category': 'techdle_state_category',
};

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


export function safeGetItem(key: string): string | null {
  try { if (typeof window !== 'undefined') return window.localStorage.getItem(key); } catch (e) {}
  return null;
}

export function safeSetItem(key: string, value: string): void {
  try { if (typeof window !== 'undefined') window.localStorage.setItem(key, value); } catch (e) {}
}

export function safeRemoveItem(key: string): void {
  try { if (typeof window !== 'undefined') window.localStorage.removeItem(key); } catch (e) {}
}

// ── LocalStorage (anonymous play) ──────────────────────────────────


export function loadGameStateByMode(mode: GameMode): GameState | null {
  if (typeof window === 'undefined') return null;
  const data = safeGetItem(STATE_KEYS[mode]);
  if (!data) return null;
  const parsed = decodeData(data);
  return parsed || null;
}

export function saveGameStateByMode(mode: GameMode, state: GameState): void {
  if (typeof window === 'undefined') return;
  safeSetItem(STATE_KEYS[mode], encodeData(state));
}

export function saveGameStateMinimalByMode(mode: GameMode, state: GameState): void {
  if (typeof window === 'undefined') return;
  // Strip fullPuzzle before saving to localStorage (keep localStorage lean).
  // It's re-attached from the server bundle when the user returns.
  const { fullPuzzle, ...minimal } = state;
  safeSetItem(STATE_KEYS[mode], encodeData(minimal));
}

// Backward compatibility or default usage
export function loadGameState(): GameState | null {
  return loadGameStateByMode('daily');
}

export function saveGameState(state: GameState): void {
  saveGameStateByMode('daily', state);
}

export function saveGameStateMinimal(state: GameState): void {
  saveGameStateMinimalByMode('daily', state);
}

export function loadUserStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_USER_STATS;
  const data = safeGetItem(USER_STATS_KEY);
  if (!data) return INITIAL_USER_STATS;
  const parsed = decodeData(data);
  return parsed ? { ...INITIAL_USER_STATS, ...parsed } : INITIAL_USER_STATS;
}

export function saveUserStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  safeSetItem(USER_STATS_KEY, encodeData(stats));
}

export function loadEndlessHighScore(): number {
  if (typeof window === 'undefined') return 0;
  const data = safeGetItem(ENDLESS_HIGH_SCORE_KEY);
  return data ? parseInt(data, 10) || 0 : 0;
}

export function saveEndlessHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  safeSetItem(ENDLESS_HIGH_SCORE_KEY, score.toString());
}

export function loadArchiveResults(): ArchiveResult[] {
  if (typeof window === 'undefined') return [];
  const data = safeGetItem(ARCHIVE_RESULTS_KEY);
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
  safeSetItem(ARCHIVE_RESULTS_KEY, encodeData(results));
}

export function clearLocalData(): void {
  if (typeof window === 'undefined') return;
  safeRemoveItem(GAME_STATE_KEY);
  safeRemoveItem(STATE_KEYS['endless']);
  safeRemoveItem(STATE_KEYS['sla-time-attack']);
  safeRemoveItem(STATE_KEYS['p1-outage']);
  safeRemoveItem(USER_STATS_KEY);
  safeRemoveItem(ARCHIVE_RESULTS_KEY);
  safeRemoveItem(ENDLESS_HIGH_SCORE_KEY);
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
  return `${result.puzzleId}:${result.date}:${result.status}:${result.guessesCount}${result.solvedOnTime ? ':1' : ':0'}`;
}

function historyEntryToArchive(entry: HistoryEntry): ArchiveResult | null {
  const parts = entry.split(':');
  if (parts.length < 4) return null;
  const [puzzleId, date, status, guessesCountStr, solvedOnTimeStr] = parts;
  const guessesCount = parseInt(guessesCountStr, 10);
  if (isNaN(guessesCount)) return null;
  if (status !== 'won' && status !== 'lost') return null;
  return { 
    puzzleId, 
    date, 
    status: status as 'won' | 'lost', 
    guessesCount,
    solvedOnTime: solvedOnTimeStr === '1' 
  };
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
  const { doc, getDoc, setDoc } = await import('firebase/firestore');
  const { db, isConfigured } = await import('./firebase');
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db!, 'users', uid);
    const userDoc = await getDoc(userRef);

    const localStats = validateAndRepairStats(loadUserStats());
    const localArchive = loadArchiveResults();
    const localHistory = localArchive.map(archiveToHistoryEntry);
    const localHighScore = loadEndlessHighScore();

    const now = Date.now();
    const lastSyncStr = localStorage.getItem('lastCloudSync');
    const lastSync = lastSyncStr ? parseInt(lastSyncStr, 10) : 0;
    
    // Lazy Sync Optimization:
    // If we've synced within the last 5 minutes AND we don't have new local games played today, skip.
    // (This avoids doing a getDoc + setDoc on every single page refresh)
    const isRecentlySynced = (now - lastSync) < 5 * 60 * 1000;
    const hasPlayedTodayLocally = localStats.lastPlayedDate === getTodayDateString();
    
    // We only skip if we are recently synced AND we didn't just play today (which might need cloud sync)
    // Actually, a simpler robust heuristic: just skip if we synced in the last hour, 
    // unless local data changed since last sync (we can track a `localDataDirty` flag).
    // For now, let's just skip if recently synced to save reads on app load.
    if (isRecentlySynced && !hasPlayedTodayLocally) {
      return;
    }

    if (!userDoc.exists()) {
      // First sync: write everything
      const data: UserDocument = {
        stats: localStats,
        history: localHistory,
        updatedAt: now,
        endlessHighScore: localHighScore,
      };
      await setDoc(userRef, data);
    } else {
      const cloud = userDoc.data() as UserDocument;
      const cloudStats = cloud.stats || INITIAL_USER_STATS;
      const cloudHighScore = cloud.endlessHighScore || 0;

      // Merge stats: take whichever has more totalPlayed
      const mergedStats = localStats.totalPlayed >= (cloudStats.totalPlayed || 0)
        ? { ...localStats }
        : { ...cloudStats };

      // EDGE CASE: If the user played today locally, but mergedStats doesn't reflect today,
      // explicitly add today's local game to the cloud stats.
      const today = getTodayDateString();
      const gameState = loadGameState();
      if (
        gameState && 
        gameState.date === today && 
        gameState.status !== 'playing' &&
        mergedStats.lastPlayedDate !== today
      ) {
        mergedStats.totalPlayed += 1;
        mergedStats.lastPlayedDate = today;
        if (gameState.status === 'won') {
          mergedStats.wins += 1;
          const yesterday = getYesterdayDateString();
          if (cloudStats.lastPlayedDate === yesterday) {
            mergedStats.currentStreak = (cloudStats.currentStreak || 0) + 1;
          } else {
            mergedStats.currentStreak = 1;
          }
          if (mergedStats.currentStreak > mergedStats.maxStreak) {
            mergedStats.maxStreak = mergedStats.currentStreak;
          }
          const guessesCount = gameState.guesses.length as 1 | 2 | 3 | 4 | 5 | 6;
          mergedStats.guessDistribution[guessesCount] = (mergedStats.guessDistribution[guessesCount] || 0) + 1;
        } else {
          mergedStats.currentStreak = 0;
          mergedStats.guessDistribution.loss = (mergedStats.guessDistribution.loss || 0) + 1;
        }
      }

      // Merge high score
      const mergedHighScore = Math.max(localHighScore, cloudHighScore);

      const cloudArchive = archiveHistoryToResults(cloud.history || []);
      const cloudMapArchive = cloud.historyMap ? archiveHistoryToResults(Object.values(cloud.historyMap)) : [];
      
      const allArchives = [...localArchive];
      for (const cloudResult of [...cloudArchive, ...cloudMapArchive]) {
        const exists = allArchives.some((r) => r.puzzleId === cloudResult.puzzleId);
        if (!exists) allArchives.push(cloudResult);
      }
      // Sort most recent first
      allArchives.sort((a, b) => b.date.localeCompare(a.date));

      const mergedHistory = allArchives.map(archiveToHistoryEntry);
      
      // Convert merged history back into the optimized historyMap format
      const newHistoryMap: Record<string, HistoryEntry> = {};
      allArchives.forEach(result => {
        newHistoryMap[result.puzzleId] = archiveToHistoryEntry(result);
      });

      const data: UserDocument = {
        stats: mergedStats,
        history: [], // clear legacy array to save space
        historyMap: newHistoryMap,
        updatedAt: now,
        endlessHighScore: mergedHighScore,
      };
      await setDoc(userRef, data);

      // Sync back to local if cloud was ahead
      if (cloudStats.totalPlayed > localStats.totalPlayed) {
        saveUserStats(cloudStats);
        const syncedArchive = archiveHistoryToResults(mergedHistory);
        safeSetItem(ARCHIVE_RESULTS_KEY, encodeData(syncedArchive));
      }
      if (cloudHighScore > localHighScore) {
        saveEndlessHighScore(cloudHighScore);
      }
      localStorage.setItem('lastCloudSync', now.toString());
    }
  } catch (err: any) {
    if (err?.code === 'unavailable' || err?.code === 'resource-exhausted' || err?.message?.includes('offline')) {
      console.warn("Firestore is unreachable or quota exceeded. Progress is saved locally and will sync later.");
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
  const { doc, setDoc } = await import('firebase/firestore');
  const { db, isConfigured } = await import('./firebase');
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db, 'users', uid);
    // Use setDoc with merge so we don't overwrite the history array
    await setDoc(userRef, { stats, updatedAt: Date.now() }, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable' && err?.code !== 'resource-exhausted') {
      console.error("Failed to sync stats:", err);
    }
  }
}

/**
 * Sync endless high score to Firestore.
 */
export async function syncEndlessHighScoreToFirestore(uid: string, score: number): Promise<void> {
  const { doc, setDoc } = await import('firebase/firestore');
  const { db, isConfigured } = await import('./firebase');
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { endlessHighScore: score, updatedAt: Date.now() }, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable' && err?.code !== 'resource-exhausted') {
      console.error("Failed to sync high score:", err);
    }
  }
}

/**
 * Sync archive history to Firestore.
 * Called after a game completes to persist the result.
 */
export async function syncArchiveToFirestore(uid: string, result: ArchiveResult): Promise<void> {
  const { doc, setDoc } = await import('firebase/firestore');
  const { db, isConfigured } = await import('./firebase');
  if (!isConfigured || !db) return;

  try {
    const userRef = doc(db, 'users', uid);
    const entry = archiveToHistoryEntry(result);

    // O(1) Write: Update exactly the property in the map without reading the whole doc
    await setDoc(userRef, { 
      [`historyMap.${result.puzzleId}`]: entry,
      updatedAt: Date.now() 
    }, { merge: true });
  } catch (err: any) {
    if (err?.code !== 'unavailable' && err?.code !== 'resource-exhausted') {
      console.error("Failed to sync archive:", err);
    }
  }
}

/**
 * Load a user's complete data from Firestore (single doc read = one read).
 */
export async function loadUserDocument(uid: string): Promise<UserDocument | null> {
  const { doc, getDoc } = await import('firebase/firestore');
  const { db, isConfigured } = await import('./firebase');
  if (!isConfigured || !db) return null;

  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    const data = snap.data() as UserDocument;
    
    // Combine legacy history array and new historyMap
    const mapValues = data.historyMap ? Object.values(data.historyMap) : [];
    const legacyValues = data.history || [];
    const combined = [...legacyValues, ...mapValues];
    
    data.history = Array.from(new Set(combined)); // deduplicate if necessary
    return data;
  } catch {
    return null;
  }
}
