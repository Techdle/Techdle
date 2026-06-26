import { Puzzle, GameState } from '../types/game';
import { ClueList } from './ClueList';
import { GuessInput } from './GuessInput';
import { ResolutionTicket } from './ResolutionTicket';
import { ShareButton } from './ShareButton';
import { RefreshCw, Bug } from 'lucide-react';
import { useAuth } from './AuthProvider';
import { getAllAliases } from '../lib/puzzles';

interface GameBoardProps {
  puzzle: Puzzle;
  state: GameState;
  onSubmit: (guess: string) => void;
  maxGuesses: number;
  incorrectCount: number;
  onRestart?: () => void;
  onReveal?: () => void;
}

export function GameBoard({ 
  puzzle, 
  state, 
  onSubmit, 
  maxGuesses, 
  incorrectCount,
  onRestart,
  onReveal 
}: GameBoardProps) {
  const { isDevMode } = useAuth();
  const isGameOver = state.status !== 'playing';
  const isWin = state.status === 'won';

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="text-center mb-4">
        {isDevMode && !isGameOver && onRestart && onReveal && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={onRestart}
              className="flex items-center gap-1.5 text-xs font-medium text-warning bg-warning/10 hover:bg-warning/20 border border-warning/30 px-3 py-1.5 rounded-full transition-colors"
              title="Restart puzzle (dev mode)"
            >
              <RefreshCw className="w-3 h-3" />
              Restart
            </button>
            <button
              onClick={onReveal}
              className="flex items-center gap-1.5 text-xs font-medium text-error bg-error/10 hover:bg-error/20 border border-error/30 px-3 py-1.5 rounded-full transition-colors"
              title="Reveal answer (dev mode)"
            >
              <Bug className="w-3 h-3" />
              Reveal
            </button>
          </div>
        )}
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
          {isDevMode && onRestart && (
            <div className="flex justify-center">
              <button
                onClick={onRestart}
                className="flex items-center gap-2 px-6 py-3 bg-warning hover:bg-warning text-text-main font-bold rounded-lg transition-colors shadow-lg shadow-warning/20"
              >
                <RefreshCw className="w-5 h-5" />
                Play Again (Dev Mode)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
