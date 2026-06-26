import { Header } from '@/components/Header';
import { Terminal, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <Terminal className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4">About Techdle</h1>
          <p className="text-xl text-slate-400">The daily IT troubleshooting puzzle.</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-slate-100 mb-4">How to Play</h2>
            <p className="mb-4">
              Every day, a new support ticket is generated. You start with only the vaguest symptom.
              Your goal is to identify the root cause of the issue in 6 guesses or fewer.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-400">
              <li>Type your diagnosis into the guess input.</li>
              <li>A wrong guess will reveal the next clue line, giving you more context.</li>
              <li>A correct guess instantly solves the ticket.</li>
              <li>After winning or losing, you'll receive a Resolution Ticket with diagnostic notes and standard fix steps.</li>
            </ul>
          </section>

          <section className="bg-amber-900/20 border border-amber-900/50 p-6 rounded-xl">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-semibold text-amber-500 mb-2">Disclaimer</h2>
                <p className="text-sm text-amber-200/80">
                  Techdle is a game designed for fun and practice. The scenarios, explanations, and fix steps are simplified 
                  and generalized for gameplay purposes. <strong>Do not use Techdle as a primary source for real-world IT troubleshooting or production system repairs.</strong> Always consult official documentation and company policies.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8 border-t border-slate-800">
            <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Play Today's Puzzle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
