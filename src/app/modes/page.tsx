import { Terminal, Infinity as InfinityIcon, Timer, AlertOctagon, ArrowLeft, FolderGit2 } from 'lucide-react';
import Link from 'next/link';

export default function ModesPage() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center px-6 animate-in fade-in duration-500 overflow-y-auto pt-12 pb-8">
      <div className="w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-700 delay-150 fill-mode-both mx-auto">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Daily Game
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-surface border border-border p-4 rounded-2xl shadow-xl">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-text-main tracking-tight font-serif">
                Other Gamemodes
              </h1>
              <p className="text-text-muted mt-1">Play specialized Techdle experiences.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mb-12">
          {/* Endless Mode */}
          <Link
            href="/modes/endless"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
          >

            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-primary/10 transition-colors">
              <InfinityIcon className="w-8 h-8 text-text-main group-hover:text-primary transition-colors" />
            </div>
            <div>
              <span className="block font-bold text-text-main text-xl mb-1">The Ticket Queue (Endless)</span>
              <span className="block text-sm text-text-muted">Unlimited play & streak tracking. Clear tickets as long as you can.</span>
            </div>
          </Link>

          {/* SLA Time Attack */}
          <Link
            href="/modes/sla-time-attack"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-orange-500/10 transition-colors">
              <Timer className="w-8 h-8 text-orange-500 group-hover:text-orange-400 transition-colors" />
            </div>
            <div>
              <span className="block font-bold text-text-main text-xl mb-1">SLA Time Attack</span>
              <span className="block text-sm text-text-muted">60s clock. Correct guesses add 15s. Wrong guesses subtract 5s.</span>
            </div>
          </Link>

          {/* P1 Outage */}
          <Link
            href="/modes/p1-outage"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-red-500 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-red-500/10 transition-colors">
              <AlertOctagon className="w-8 h-8 text-red-500 group-hover:text-red-400 transition-colors" />
            </div>
            <div>
              <span className="block font-bold text-text-main text-xl mb-1">P1 Outage Mode</span>
              <span className="block text-sm text-text-muted">3 guesses only. Read raw server crash logs. Hard mode.</span>
            </div>
          </Link>

          {/* Category Drill */}
          <Link
            href="/modes/category"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-blue-500 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-blue-500/10 transition-colors">
              <FolderGit2 className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
            </div>
            <div>
              <span className="block font-bold text-text-main text-xl mb-1">Category Drill</span>
              <span className="block text-sm text-text-muted">Choose Hardware, Network, Security, or Software and drill tickets endlessly.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
