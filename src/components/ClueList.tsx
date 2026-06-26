import { ClientPuzzle, GameState } from '../types/game';

interface ClueListProps {
  puzzle: ClientPuzzle;
  state: GameState;
  maxGuesses: number;
}

export function ClueList({ puzzle, state, maxGuesses }: ClueListProps) {
  // Number of clues revealed = number of guesses + 1 (start with 1 clue)
  // Or all clues if game is over
  const isGameOver = state.status !== 'playing';
  const revealedCount = isGameOver ? puzzle.clues.length : Math.min(state.guesses.length + 1, puzzle.clues.length);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {puzzle.clues.map((clue, index) => {
        const isRevealed = index < revealedCount;
        return (
          <div 
            key={index}
            onCopy={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              isRevealed 
                ? 'bg-slate-800/50 border-slate-700 text-slate-200 shadow-md select-none' 
                : 'bg-slate-900/30 border-slate-800/50 text-transparent select-none'
            }`}
          >
            <div className="flex gap-4">
              <span className={`font-mono text-sm ${isRevealed ? 'text-blue-400' : 'text-transparent'}`}>
                #{index + 1}
              </span>
              <p>{isRevealed ? clue : '...'}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
