import { ClientPuzzle, GameState } from '../types/game';

interface ClueListProps {
  puzzle: ClientPuzzle;
  state: GameState;
}

export function ClueList({ puzzle, state }: ClueListProps) {
  // Number of clues revealed = number of guesses + 1 (start with 1 clue)
  // Or all clues if game is over
  const isGameOver = state.status !== 'playing';
  const revealedCount = isGameOver ? puzzle.clues.length : Math.min(state.guesses.length + 1, puzzle.clues.length);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {puzzle.clues.map((clue, index) => {
        const isRevealed = index < revealedCount;
        
        const hasGuessed = index < state.guesses.length;
        const isWinningGuess = hasGuessed && index === state.guesses.length - 1 && state.status === 'won';
        const isWrongGuess = hasGuessed && !isWinningGuess;
        
        let bgClass = 'bg-surface-raised/50';
        let borderClass = 'border-border';
        
        if (isWrongGuess) {
          bgClass = 'bg-error/10';
          borderClass = 'border-error/50';
        } else if (isWinningGuess) {
          bgClass = 'bg-success/10';
          borderClass = 'border-success/50';
        }

        return (
          <div 
            key={index}
            onCopy={(e) => e.preventDefault()}
            onContextMenu={(e) => e.preventDefault()}
            className={`p-4 rounded-lg border transition-all duration-500 ${
              isRevealed 
                ? `${bgClass} ${borderClass} text-text-main shadow-md select-none` 
                : 'bg-surface/30 border-border/50 text-transparent select-none'
            }`}
          >
            <div className="flex gap-4">
              <span className={`font-mono text-sm ${isRevealed ? (isWrongGuess ? 'text-error' : isWinningGuess ? 'text-success' : 'text-primary') : 'text-transparent'}`}>
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
