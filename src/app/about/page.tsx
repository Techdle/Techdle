import { Header } from '@/components/Header';
import { Terminal, AlertTriangle, Lightbulb, Search, BookOpen, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
            <Terminal className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-text-main">About Techdle</h1>
          <p className="text-xl text-text-muted max-w-xl mx-auto">
            Experience the daily thrill of IT troubleshooting, no computer science degree required.
          </p>
        </div>

        <div className="space-y-12 text-text-muted leading-relaxed">
          
          {/* Section: What is Techdle */}
          <section className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm transition-colors hover:border-border/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Lightbulb className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-main m-0">What is Techdle?</h2>
            </div>
            <p className="mb-4 text-lg">
              Have you ever played Wordle? Techdle is similar, but instead of guessing a hidden 5-letter word, you're playing the role of a tech support wizard trying to diagnose a broken computer or a strange networking issue.
            </p>
            <p className="text-lg">
              Every single day, a new "support ticket" is generated. It's up to you to look at the symptoms, figure out what's causing the problem, and save the day!
            </p>
          </section>

          {/* Section: How to Play */}
          <section className="space-y-6 pt-4">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Search className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold text-text-main m-0">How To Play</h2>
            </div>
            
            <div className="grid gap-6">
              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">1</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Read the initial symptom</h3>
                  <p className="text-sm sm:text-base">You'll start with a very vague complaint from a user, like <em className="text-text-main font-medium">"My computer is running really slowly."</em></p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">2</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Make a guess</h3>
                  <p className="text-sm sm:text-base">Type in what you think the root cause is (for example, "Virus" or "Failing Hard Drive"). Don't worry about being perfectly accurate—our system is smart and forgiving! "Broken wifi" and "wifi is down" will both be accepted.</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">3</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Get more clues</h3>
                  <p className="text-sm sm:text-base">If your guess is wrong, you'll be given a brand new clue that provides more detail, like <em className="text-text-main font-medium">"I also hear a weird clicking noise coming from the computer case."</em></p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">4</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Solve within 6 tries</h3>
                  <p className="text-sm sm:text-base">You have a total of 6 attempts to figure out the exact problem. If you succeed, you'll get a detailed breakdown of the root cause and the standard steps to fix it!</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Who is it for */}
          <div className="grid sm:grid-cols-2 gap-6 pt-6">
            <section className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <UserCheck className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text-main m-0">Who is this for?</h2>
              </div>
              <p className="text-sm sm:text-base flex-1">
                <strong className="text-text-main">Everyone!</strong> While it was made with IT professionals in mind, many puzzles cover everyday tech issues that anyone can relate to—like forgetting a password, dealing with a paper jam, or accidentally turning off the Wi-Fi. It's a fantastic way to learn how your daily devices actually work under the hood.
              </p>
            </section>

            <section className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-text-main m-0">The Dictionary</h2>
              </div>
              <p className="text-sm sm:text-base flex-1">
                Whenever you play a puzzle, the solution is permanently unlocked in your <strong className="text-text-main">Answer Dictionary</strong>. Over time, you'll build up a personal encyclopedia of tech problems and learn the standard operating procedures for fixing them.
              </p>
            </section>
          </div>

          <section className="bg-warning/10 border border-warning/30 p-6 rounded-xl mt-8">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-warning shrink-0" />
              <div>
                <h2 className="text-lg font-bold text-warning mb-2">Disclaimer</h2>
                <p className="text-sm text-warning/90 leading-relaxed">
                  Techdle is a game designed for fun and educational practice. The scenarios, explanations, and fix steps are simplified 
                  for gameplay purposes. <strong className="text-warning font-bold">Do not use Techdle as a primary source for real-world IT troubleshooting or repairing critical systems.</strong> Always consult official documentation or a certified professional.
                </p>
              </div>
            </div>
          </section>

          <div className="text-center pt-8 pb-12">
            <Link href="/" className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-primary hover:bg-primary-hover text-background font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-primary/25">
              Play Today's Puzzle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
