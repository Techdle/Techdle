import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Bug } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Game
        </Link>

        <h1 className="text-3xl font-bold mb-2">Contact &amp; Support</h1>
        <p className="text-text-muted text-sm mb-8">We&apos;re here to help.</p>

        <div className="space-y-6 text-sm text-text-muted leading-relaxed">

          <section className="bg-surface/50 border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-text-main mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Email
            </h2>
            <p className="mb-2">
              For general inquiries, support requests, or feedback, email us at:
            </p>
            <a href="mailto:techdle.game@gmail.com" className="text-primary hover:underline font-medium">
              techdle.game@gmail.com
            </a>
            <p className="text-text-muted text-xs mt-2">
              We typically respond within 2&ndash;3 business days.
            </p>
          </section>

          <section className="bg-surface/50 border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-text-main mb-3 flex items-center gap-2">
              <Bug className="w-4 h-4 text-primary" /> Bug Reports &amp; Feature Requests
            </h2>
            <p className="mb-2">
              Found a bug or have an idea for a new feature? Email us directly:
            </p>
            <a href="mailto:techdle.game@gmail.com" className="text-primary hover:underline font-medium">
              techdle.game@gmail.com
            </a>
            <p className="text-text-muted text-xs mt-2">
              Please include &quot;Bug Report&quot; or &quot;Feature Request&quot; in the subject line.
            </p>
          </section>

          <section className="bg-surface/50 border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-text-main mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Data &amp; Privacy Requests
            </h2>
            <p className="mb-2">
              For data deletion requests, privacy concerns, or inquiries about your personal data:
            </p>
            <a href="mailto:techdle.game@gmail.com" className="text-primary hover:underline font-medium">
              techdle.game@gmail.com
            </a>
            <p className="text-text-muted text-xs mt-2">
              Please include &quot;Data Request&quot; in the subject line for faster processing.
            </p>
          </section>

          <section className="bg-surface/50 border border-border rounded-lg p-5">
            <h2 className="text-lg font-semibold text-text-main mb-2">Other Resources</h2>
            <ul className="space-y-2 text-text-muted">
              <li>
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                <span className="text-text-muted ml-1">&mdash; How we handle your data</span>
              </li>
              <li>
                <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                <span className="text-text-muted ml-1">&mdash; Rules for using Techdle</span>
              </li>
              <li>
                <Link href="/accessibility" className="text-primary hover:underline">Accessibility Statement</Link>
                <span className="text-text-muted ml-1">&mdash; Our commitment to inclusive design</span>
              </li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
