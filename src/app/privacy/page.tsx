import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: June 25, 2026</p>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">1. Data We Collect</h2>
            <p>
              Techdle collects minimal data necessary for the game to function:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Game Progress</strong> — Your guesses, wins, streaks, and stats are stored locally in your browser and optionally synced to Firebase Firestore if you link a Google account.</li>
              <li><strong className="text-slate-300">Account Information</strong> — If you link a Google account, we receive your email address and Google UID for the sole purpose of identifying your profile and syncing game data across devices.</li>
              <li><strong className="text-slate-300">Anonymous Identifier</strong> — If you play without linking an account, Firebase assigns an anonymous UID to track your session. This is not linked to any personal information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>To save and restore your game progress across devices</li>
              <li>To display your personal stats (wins, streaks, guess distribution)</li>
              <li>To enable dev mode for the application administrator</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">3. Data Storage &amp; Security</h2>
            <p>
              Game data is stored locally in your browser&apos;s localStorage. If you link a Google account, data is additionally synced to Firebase Firestore (Google Cloud).
              Puzzle answers are encrypted at rest using AES-256-GCM and are decrypted server-side only when needed for gameplay.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">4. Third-Party Services</h2>
            <p>
              Techdle uses the following third-party services:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400">
              <li><strong className="text-slate-300">Firebase (Google)</strong> — Authentication and Firestore database. See <Link href="https://firebase.google.com/support/privacy" className="text-blue-400 hover:underline">Google&apos;s Privacy Policy</Link>.</li>
              <li><strong className="text-slate-300">DeepSeek</strong> — Used in dev mode for automatic puzzle generation. No user game data is sent.</li>
              <li><strong className="text-slate-300">Vercel</strong> — Hosting platform. See <Link href="https://vercel.com/legal/privacy" className="text-blue-400 hover:underline">Vercel&apos;s Privacy Policy</Link>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">5. Cookies</h2>
            <p>
              Techdle does not use tracking cookies. Firebase Auth uses local storage tokens for session management.
              No analytics or advertising cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">6. Your Rights</h2>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>You can sign out and stop using the app at any time.</li>
              <li>Local data can be cleared by clearing your browser&apos;s site data.</li>
              <li>To request deletion of cloud-synced data, contact the administrator at <span className="text-blue-400">johnlemargonzales@gmail.com</span>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-100 mb-2">7. Contact</h2>
            <p>
              For privacy concerns or data requests, contact: <span className="text-blue-400">johnlemargonzales@gmail.com</span>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
