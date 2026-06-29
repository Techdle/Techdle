import { Trophy, Clock, Target, ShieldAlert } from 'lucide-react';

export interface LeaderboardEntry {
  uid: string;
  displayName: string;
  timeMs: number;
  streak: number;
  submittedAt: number;
}

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (!entries || entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-surface border border-border rounded-2xl">
        <div className="w-16 h-16 bg-surface-raised rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-text-muted" />
        </div>
        <h3 className="text-xl font-bold text-text-main mb-2">No Solves Yet</h3>
        <p className="text-text-muted text-center max-w-sm">
          No one has solved today&apos;s puzzle yet. Be the first to claim the #1 spot!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead>
            <tr className="bg-surface-raised border-b border-border text-text-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-bold text-center w-16">Rank</th>
              <th className="px-6 py-4 font-bold">Player</th>
              <th className="px-6 py-4 font-bold text-right">Time</th>
              <th className="px-6 py-4 font-bold text-center">Streak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {entries.map((entry, idx) => {
              const isFirst = idx === 0;
              const isSecond = idx === 1;
              const isThird = idx === 2;
              
              let rankColor = "text-text-muted";
              let rankBg = "bg-transparent";
              if (isFirst) {
                rankColor = "text-yellow-500";
                rankBg = "bg-yellow-500/10 border-yellow-500/20";
              } else if (isSecond) {
                rankColor = "text-slate-400";
                rankBg = "bg-slate-400/10 border-slate-400/20";
              } else if (isThird) {
                rankColor = "text-amber-700";
                rankBg = "bg-amber-700/10 border-amber-700/20";
              }

              const displayTime = (entry.timeMs / 1000).toFixed(2) + "s";

              return (
                <tr 
                  key={entry.uid} 
                  className="transition-colors hover:bg-surface-raised/50"
                >
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <div className={`w-8 h-8 flex items-center justify-center rounded-full border border-transparent font-bold text-sm ${rankBg} ${rankColor}`}>
                        {isFirst ? <Trophy className="w-4 h-4" /> : `#${idx + 1}`}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-text-main flex items-center gap-2">
                      {entry.displayName}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="font-mono font-bold text-primary flex items-center justify-end gap-1.5">
                      <Clock className="w-4 h-4 opacity-50" />
                      {displayTime}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center min-w-[3rem] px-2 py-1 rounded-md bg-surface-raised text-text-main font-bold font-mono text-sm border border-border">
                      {entry.streak}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
