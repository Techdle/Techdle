import { Header } from '@/components/Header';
import { Terminal, AlertTriangle, Lightbulb, Search, BookOpen, UserCheck, Sparkles } from 'lucide-react';
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
              Have you ever played Wordle? Techdle is similar, but instead of guessing a hidden 5-letter word, you&apos;re playing the role of a tech support wizard trying to diagnose a broken computer or a strange networking issue.
            </p>
            <p className="text-lg">
              Every single day, a new &quot;support ticket&quot; is generated. It&apos;s up to you to look at the symptoms, figure out what&apos;s causing the problem, and save the day!
            </p>
          </section>

          {/* Section: Origin Story */}
          <section className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm transition-colors hover:border-border/80">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text-main m-0">The Origin Story</h2>
            </div>
            <p className="mb-4 text-lg">
              Techdle is proud to be the very first <strong>tech Wordle-type game</strong> on the internet! 
            </p>
            <p className="text-lg">
              The idea was born after our creator—an IT professional—was watching Doctor Mike on YouTube play a medical diagnostic game called <a href="https://doctordle.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-bold">Doctordle</a>. It sparked a sudden realization: <em>&quot;Why not make a similar website, but themed entirely around the crazy IT support tickets we deal with every day?&quot;</em> And just like that, Techdle was born.
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
                  <p className="text-sm sm:text-base">You&apos;ll start with a very vague complaint from a user, like <em className="text-text-main font-medium">&quot;My computer is running really slowly.&quot;</em></p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">2</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Make a guess</h3>
                  <p className="text-sm sm:text-base">Type in what you think the root cause is (for example, &quot;Virus&quot; or &quot;Failing Hard Drive&quot;). Don&apos;t worry about being perfectly accurate—our system is smart and forgiving! &quot;Broken wifi&quot; and &quot;wifi is down&quot; will both be accepted.</p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">3</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Get more clues</h3>
                  <p className="text-sm sm:text-base">If your guess is wrong, you&apos;ll be given a brand new clue that provides more detail, like <em className="text-text-main font-medium">&quot;I also hear a weird clicking noise coming from the computer case.&quot;</em></p>
                </div>
              </div>

              <div className="flex gap-4 sm:gap-6 bg-surface/50 p-4 rounded-xl border border-border/50">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-main font-bold shrink-0 shadow-sm text-lg">4</div>
                <div>
                  <h3 className="text-lg font-bold text-text-main mb-1">Solve within 6 tries</h3>
                  <p className="text-sm sm:text-base">You have a total of 6 attempts to figure out the exact problem. If you succeed, you&apos;ll get a detailed breakdown of the root cause and the standard steps to fix it!</p>
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
                <strong className="text-text-main">Everyone!</strong> While it was made with IT professionals in mind, many puzzles cover everyday tech issues that anyone can relate to—like forgetting a password, dealing with a paper jam, or accidentally turning off the Wi-Fi. It&apos;s a fantastic way to learn how your daily devices actually work under the hood.
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
                Whenever you play a puzzle, the solution is permanently unlocked in your <strong className="text-text-main">Answer Dictionary</strong>. Over time, you&apos;ll build up a personal encyclopedia of tech problems and learn the standard operating procedures for fixing them.
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
              Play Today&apos;s Puzzle
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
