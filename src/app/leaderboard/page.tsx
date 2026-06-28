import { Header } from '@/components/Header';
import { LeaderboardTable, LeaderboardEntry } from '@/components/LeaderboardTable';
import { getTodayDateString } from '@/lib/date';
import { db } from '@/lib/firebase';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';

export const revalidate = 300; // Cache for 5 minutes (ISR) to reduce Firebase reads to 0 for most requests

export const metadata = {
  title: 'Daily Leaderboard - Techdle',
  description: 'See the fastest solve times for today\'s Techdle.',
};

async function getLeaderboardEntries(): Promise<LeaderboardEntry[]> {
  if (!db) return [];
  
  try {
    const today = getTodayDateString();
    const entriesRef = collection(db, 'dailyLeaderboards', today, 'entries');
    const q = query(entriesRef, orderBy('timeMs', 'asc'), limit(100));
    
    const snapshot = await getDocs(q);
    const entries: LeaderboardEntry[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      entries.push({
        uid: data.uid,
        displayName: data.displayName || 'Unknown',
        timeMs: data.timeMs || 9999999,
        streak: data.streak || 0,
        submittedAt: data.submittedAt || 0,
      });
    });
    
    return entries;
  } catch (err) {
    console.error("Failed to fetch leaderboard:", err);
    return [];
  }
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboardEntries();
  const today = getTodayDateString();

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="w-full max-w-4xl mx-auto flex flex-col gap-8 px-4 py-12 animate-in fade-in">
        
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-primary">Daily Leaderboard</h1>
          <p className="text-text-muted max-w-lg mx-auto">
            The fastest players to solve today's puzzle. 
            Scores update dynamically.
          </p>
          <div className="mt-4 text-xs font-mono text-text-muted border border-border bg-surface-raised inline-block px-3 py-1 rounded-full">
            DATE: {today}
          </div>
        </div>

        <LeaderboardTable entries={entries} />

      </main>
    </div>
  );
}
