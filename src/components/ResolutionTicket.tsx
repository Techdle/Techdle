import { Puzzle } from '../types/game';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResolutionTicketProps {
  puzzle: Puzzle;
  isWin: boolean;
}

export function ResolutionTicket({ puzzle, isWin }: ResolutionTicketProps) {
  return (
    <div className="w-full max-w-2xl mx-auto mt-8 rounded-xl overflow-hidden border border-slate-700 bg-slate-800/50 shadow-2xl">
      {/* Header */}
      <div className={`px-6 py-4 flex items-center gap-3 ${isWin ? 'bg-green-900/40 border-b border-green-800' : 'bg-red-900/40 border-b border-red-800'}`}>
        {isWin ? (
          <CheckCircle2 className="w-6 h-6 text-green-400" />
        ) : (
          <AlertCircle className="w-6 h-6 text-red-400" />
        )}
        <div>
          <h2 className="text-lg font-bold text-slate-100">
            {isWin ? 'Resolution Successful' : 'Ticket Escalated'}
          </h2>
          <p className="text-sm text-slate-400">
            Root Cause: <span className="text-slate-200 font-semibold capitalize">{puzzle.answer}</span>
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Diagnostic Notes</h3>
          <p className="text-slate-200 leading-relaxed bg-slate-900/50 p-4 rounded-lg border border-slate-800">
            {puzzle.explanation}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Standard Operating Procedure (Fix Steps)</h3>
          <ul className="space-y-2">
            {puzzle.fixSteps.map((step, i) => (
              <li key={i} className="flex gap-3 text-slate-300">
                <span className="text-blue-400 font-mono text-sm mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
