import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-6 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">1. Welcome to Techdle</h2>
            <p>
              Techdle is a free, daily tech-themed word puzzle game created as a hobby project. 
              By playing the Game, you agree to these Terms. If you don&apos;t agree, please don&apos;t play!
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">2. Accounts & Data</h2>
            <p className="mb-2">
              You can play Techdle completely anonymously. If you choose to sign in with Google to sync your stats across devices:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>We only store the minimal data needed to save your progress (your email, a user ID, and your game stats).</li>
              <li>You can request account deletion at any time by emailing us at <span className="text-primary">techdle.game@gmail.com</span>.</li>
              <li>Please see our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link> for more details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">3. Acceptable Use</h2>
            <p className="mb-2">Please play fair and be nice. Specifically, don&apos;t:</p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Use bots or scripts to scrape the game or cheat.</li>
              <li>Try to hack, reverse-engineer, or disrupt the servers.</li>
              <li>Use the game for commercial purposes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">4. Disclaimers & Liability</h2>
            <p className="mb-2">
              Techdle is provided &quot;as is&quot; for fun. We try to keep it running smoothly, but we don&apos;t guarantee it will always be bug-free or available.
            </p>
            <p>
              Since this is a free hobby project, we are not liable for any damages or issues that arise from using the game. We reserve the right to modify or shut down the game at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">5. Third-Party Services</h2>
            <p>
              Techdle relies on services like Firebase (for authentication and database) and Vercel (for hosting). 
              Your use of Techdle is also subject to their respective terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">6. Changes to Terms</h2>
            <p>
              We might update these terms occasionally. We&apos;ll update the date at the top of this page when we do. 
              Continuing to play means you accept the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">7. Contact</h2>
            <p>
              Questions? Bugs? Just want to say hi? Email us at: <span className="text-primary">techdle.game@gmail.com</span>
            </p>
          </section>

        </div>
      </main>
    </div>
  );
}
