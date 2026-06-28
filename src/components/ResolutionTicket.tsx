import { Puzzle } from '../types/game';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface ResolutionTicketProps {
  puzzle: Puzzle;
  isWin: boolean;
}

export function ResolutionTicket({ puzzle, isWin }: ResolutionTicketProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-xl overflow-hidden border border-border bg-surface-raised/50 shadow-2xl">
      {/* Header */}
      <div className={`px-6 py-4 flex items-center gap-3 ${isWin ? 'bg-success/40 border-b border-success' : 'bg-error/40 border-b border-error'}`}>
        {isWin ? (
          <CheckCircle2 className="w-6 h-6 text-success" />
        ) : (
          <AlertCircle className="w-6 h-6 text-error" />
        )}
        <div>
          <h2 className="text-lg font-bold text-text-main">
            {isWin ? 'Resolution Successful' : 'Ticket Escalated'}
          </h2>
          <p className="text-sm text-text-muted">
            Root Cause: <span className="text-text-main font-semibold capitalize">{puzzle.answer}</span>
          </p>
          {puzzle.aliases && puzzle.aliases.length > 0 && (
            <p className="text-xs text-text-muted/70 mt-1">
              Also accepted: {puzzle.aliases.join(', ')}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Diagnostic Notes</h3>
          <p className="text-text-main leading-relaxed bg-surface/50 p-4 rounded-lg border border-border">
            {puzzle.explanation}
          </p>
        </div>

        <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_1" />

        <div>
          <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-2">Standard Operating Procedure (Fix Steps)</h3>
          <ul className="space-y-2">
            {puzzle.fixSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-text-muted">
                <span className="text-primary font-mono text-sm mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
