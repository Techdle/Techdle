import { ClientPuzzle, GameState, Puzzle } from '../types/game';

interface ClueListProps {
  puzzle: ClientPuzzle | Puzzle;
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
                ? 'bg-surface-raised/50 border-border text-text-main shadow-md select-none' 
                : 'bg-surface/30 border-border/50 text-transparent select-none'
            }`}
          >
            <div className="flex gap-4">
              <span className={`font-mono text-sm ${isRevealed ? 'text-primary' : 'text-transparent'}`}>
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
