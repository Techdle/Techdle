import { Puzzle, GameState } from '../types/game';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { getAllAliases } from '../lib/puzzles';

interface GameBoardProps {
  puzzle: Puzzle;
  state: GameState;
  onSubmit: (guess: string) => void;
  maxGuesses: number;
  incorrectCount: number;
}

export function GameBoard({ 
  puzzle, 
  state, 
  onSubmit, 
  maxGuesses, 
  incorrectCount,
}: GameBoardProps) {
  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">

        <h2 className="text-2xl font-bold text-text-main mt-2">Identify the Root Cause</h2>
        <p className="text-sm text-text-muted mt-2">
          Guesses: {state.guesses.length} / {maxGuesses}
        </p>
      </div>

      <ClueList puzzle={puzzle} state={state} maxGuesses={maxGuesses} />

      {!isGameOver ? (
        <GuessInput onSubmit={onSubmit} disabled={false} shakeKey={incorrectCount} targets={getAllAliases()} />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <ResolutionTicket puzzle={puzzle} isWin={isWin} />
          <ShareButton state={state} maxGuesses={maxGuesses} />
        </div>
      )}
    </div>
  );
}
