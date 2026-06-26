import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Account
        </Link>

        <h1 className="text-3xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-text-muted text-sm mb-8">Last updated: June 26, 2026</p>

        <div className="space-y-6 text-sm text-text-muted leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">1. Introduction</h2>
            <p className="mb-2">
              This Cookie Policy explains how Techdle (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) uses cookies, local storage,
              and similar tracking technologies on our website. It is designed to help you understand what
              technologies we use, why we use them, and how you can control them.
            </p>
            <p>
              This policy should be read together with our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
              and <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>, which provide
              additional information about how we collect, use, and protect your data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">2. What Are Cookies &amp; Web Storage</h2>
            <p className="mb-2">
              <strong className="text-text-main">Cookies</strong> are small text files that websites place on your
              computer or mobile device when you visit them. They are widely used to make websites work more
              efficiently and to provide information to the site owner.
            </p>
            <p className="mb-2">
              <strong className="text-text-main">Local Storage &amp; IndexedDB</strong> are modern web storage
              APIs that allow websites to store data persistently in your browser. Unlike cookies, data stored in
              localStorage and IndexedDB is not automatically sent to the server with every HTTP request.
            </p>
            <p>
              Throughout this policy, references to &quot;cookies&quot; include all equivalent browser storage
              technologies unless stated otherwise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">3. Types of Storage We Use</h2>
            <p className="mb-3">Techdle uses only the following categories of storage, all of which are <strong className="text-text-main">strictly necessary</strong> for the Game to function:</p>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">3.1 Local Storage (Essential)</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted mb-3">
              <li><strong className="text-text-muted">Game Progress</strong> — Your current puzzle state, guesses, hints used, and completion status for the daily puzzle</li>
              <li><strong className="text-text-muted">Game Statistics</strong> — Your win/loss record, streak history, and guess distribution for calculating and displaying your personal stats</li>
              <li><strong className="text-text-muted">User Preferences</strong> — Your selected theme (light/dark), high-contrast mode setting, and other UI preferences</li>
            </ul>
            <p className="text-text-muted text-xs mb-3">
              Purpose: These items are essential to provide the core gameplay experience and remember your
              preferences between sessions. No personal data from localStorage is transmitted to our servers
              unless you sign in with Google.
            </p>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">3.2 Firebase Authentication Tokens (Essential)</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted mb-3">
              <li><strong className="text-text-muted">Auth Session Tokens</strong> — If you sign in with Google, Firebase stores authentication tokens in IndexedDB/localStorage to maintain your session</li>
              <li><strong className="text-text-muted">Anonymous UID</strong> — If you play without signing in, Firebase may assign an anonymous user identifier to track your session locally</li>
            </ul>
            <p className="text-text-muted text-xs mb-3">
              Purpose: These tokens are strictly necessary for authentication and synchronization of game data
              across devices. They are set and managed by the Firebase Authentication SDK.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">4. No Tracking or Analytics Technologies</h2>
            <p className="mb-2">
              Techdle does <strong>not</strong> use any of the following:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Tracking cookies of any kind</li>
              <li>Analytics scripts (e.g., Google Analytics, Mixpanel, Amplitude)</li>
              <li>Advertising or marketing cookies</li>
              <li>Social media pixels or tracking buttons</li>
              <li>Third-party behavioral tracking services</li>
              <li>Fingerprinting technologies</li>
              <li>Cross-site tracking mechanisms</li>
            </ul>
            <p className="mt-2">
              We do not sell, trade, or share your data for advertising or marketing purposes. We do not build
              profiles of our users for targeted advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">5. Third-Party Services</h2>
            <p className="mb-2">
              The following third-party services may store data in your browser as part of their normal operation.
              We do not control their data practices:
            </p>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">5.1 Firebase (Google Inc.)</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>Stores authentication tokens and session data via IndexedDB and localStorage</li>
              <li>Does not set traditional cookies for authentication purposes</li>
              <li>See <Link href="https://firebase.google.com/support/privacy" className="text-primary hover:underline">Google&apos;s Privacy Policy</Link> and
              <Link href="https://policies.google.com/technologies/cookies" className="text-primary hover:underline"> Google&apos;s Cookie Policy</Link></li>
            </ul>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">5.2 Vercel Inc.</h3>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li>May set essential cookies required for CDN functionality, edge network routing, and site performance</li>
              <li>These are strictly functional and do not track users across sites</li>
              <li>See <Link href="https://vercel.com/legal/privacy" className="text-primary hover:underline">Vercel&apos;s Privacy Policy</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">6. Consent &amp; Your Choices</h2>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">6.1 Implied Consent</h3>
            <p className="mb-2">
              Because Techdle uses only strictly necessary storage technologies that are essential for the core
              functionality of the Game, we do not require explicit cookie consent. However, by continuing to use
              the Game, you acknowledge and accept our use of these technologies as described in this policy.
            </p>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">6.2 How to Control Your Data</h3>
            <p className="mb-2">You have full control over local storage data in your browser:</p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><strong className="text-text-muted">Clear Site Data</strong> — Use your browser&apos;s settings to clear all data stored by techdle.com. This will reset game progress, preferences, and authentication.</li>
              <li><strong className="text-text-muted">Sign Out</strong> — Signing out of your account will clear your Firebase authentication session token.</li>
              <li><strong className="text-text-muted">Private/Incognito Mode</strong> — Using the Game in private browsing mode will cause all storage to be cleared when you close the browser window.</li>
              <li><strong className="text-text-muted">Disable Local Storage</strong> — You may disable localStorage entirely in your browser settings. <strong className="text-text-main">Warning:</strong> This will prevent the Game from functioning, as we rely on local storage for core gameplay.</li>
            </ul>

            <h3 className="text-base font-medium text-text-main mb-1 mt-4">6.3 Browser-Level Controls</h3>
            <p className="mb-2">
              Most web browsers allow you to manage storage settings through their preferences or settings menus.
              The following links provide instructions for common browsers:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><Link href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline">Google Chrome</Link></li>
              <li><Link href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox" className="text-primary hover:underline">Mozilla Firefox</Link></li>
              <li><Link href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/" className="text-primary hover:underline">Safari</Link></li>
              <li><Link href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" className="text-primary hover:underline">Microsoft Edge</Link></li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">7. Data Retention</h2>
            <p className="mb-2">
              Data stored in localStorage and IndexedDB persists in your browser until you manually clear it or
              until our application code explicitly removes it. We do not set expiration dates on local storage
              data. The retention periods for data stored on our servers are as follows:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><strong className="text-text-muted">Game Progress &amp; Stats (Cloud)</strong> — Retained for as long as your account is active. Deleted upon account deletion request or after 12 months of account inactivity.</li>
              <li><strong className="text-text-muted">Authentication Tokens</strong> — Managed by Firebase. Tokens may be refreshed periodically. Revoked when you sign out or upon account deletion.</li>
              <li><strong className="text-text-muted">Anonymous UIDs</strong> — Retained for the duration of your session and up to 30 days of inactivity, after which a new anonymous ID may be assigned.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">8. Do Not Track (DNT)</h2>
            <p>
              Some browsers transmit &quot;Do Not Track&quot; (DNT) signals. As Techdle does not engage in cross-site
              tracking, analytics, or advertising, we do not respond to DNT signals. However, we respect your
              privacy and do not track your browsing activity across other websites regardless of DNT settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">9. International Users</h2>
            <p className="mb-2">
              If you are accessing the Game from outside the Republic of the Philippines, please be aware that
              your data may be processed and stored in the Philippines or other locations where our infrastructure
              providers operate. By using the Game, you consent to the transfer of your data to these locations.
            </p>
            <p>
              For users in the European Economic Area (EEA), the United Kingdom, or other jurisdictions with
              comprehensive data protection laws, we note that the storage technologies we use are strictly
              necessary for the provision of the Game and are therefore exempt from consent requirements under
              applicable ePrivacy regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">10. Updates to This Policy</h2>
            <p className="mb-2">
              We may update this Cookie Policy from time to time to reflect changes in our practices, operational
              requirements, or legal obligations. Material changes will be posted on this page with an updated
              &quot;Last updated&quot; date.
            </p>
            <p>
              We encourage you to review this Cookie Policy periodically. Your continued use of the Game after
              changes to this policy constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-main mb-2">11. Contact Us</h2>
            <p className="mb-2">
              If you have any questions, concerns, or requests regarding this Cookie Policy or our data practices,
              please contact us:
            </p>
            <ul className="list-disc list-inside space-y-1 text-text-muted">
              <li><strong className="text-text-muted">Email:</strong> <span className="text-primary">techdle.game@gmail.com</span></li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
