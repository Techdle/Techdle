import { ClientPuzzle, GameState } from '../types/game';

interface RawLogViewerProps {
  puzzle: ClientPuzzle & { rawLogs?: string[] };
  state: GameState;
  maxGuesses: number;
}

export function RawLogViewer({ puzzle, state, maxGuesses }: RawLogViewerProps) {
  const isGameOver = state.status !== 'playing';
  // Reveal 2 log lines per guess? Or just reveal progressively.
  // We have 3 guesses, and typically 4-7 lines. 
  // Let's divide the logs evenly across the maxGuesses + 1 (initial state).
  
  const rawLogs = puzzle.rawLogs || [];
  const linesPerReveal = Math.ceil(rawLogs.length / (maxGuesses + 1));
  const revealedCount = isGameOver 
    ? rawLogs.length 
    : Math.min((state.guesses.length + 1) * linesPerReveal, rawLogs.length);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-2">
      <div className="bg-black/90 border border-red-500/30 rounded-lg p-4 font-mono text-sm shadow-xl shadow-red-500/10 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-red-500/20 text-red-500/80">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          <span className="ml-2 uppercase text-xs tracking-widest font-bold">/var/log/syslog (P1 Outage)</span>
        </div>

        <div className="space-y-1">
          {rawLogs.map((logLine, index) => {
            const isRevealed = index < revealedCount;
            if (!isRevealed) {
              return (
                <div key={index} className="flex gap-4 opacity-30 select-none">
                  <span className="text-gray-600 min-w-[2ch] text-right">{index + 1}</span>
                  <span className="text-gray-800">████████████████████████...</span>
                </div>
              );
            }
            
            // Syntax highlight some parts for flavor
            const isError = logLine.toLowerCase().includes('error') || logLine.toLowerCase().includes('fail') || logLine.toLowerCase().includes('crit');
            const isWarn = logLine.toLowerCase().includes('warn');
            
            return (
              <div key={index} className="flex gap-4 hover:bg-white/5 px-1 -mx-1 rounded">
                <span className="text-gray-600 min-w-[2ch] text-right select-none">{index + 1}</span>
                <span className={`break-all ${isError ? 'text-red-400' : isWarn ? 'text-yellow-400' : 'text-gray-300'}`}>
                  {logLine}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
