import { Header } from '@/components/Header';
import Link from 'next/link';
import { ArrowLeft, Mail, MessageSquare, Bug } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header />
      <main className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Game
        </Link>

        <h1 className="text-3xl font-bold mb-2">Contact &amp; Support</h1>
        <p className="text-slate-500 text-sm mb-8">We&apos;re here to help.</p>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">

          <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-400" /> Email
            </h2>
            <p className="mb-2">
              For general inquiries, support requests, or feedback, email us at:
            </p>
            <a href="mailto:johnlemargonzales@gmail.com" className="text-blue-400 hover:underline font-medium">
              johnlemargonzales@gmail.com
            </a>
            <p className="text-slate-500 text-xs mt-2">
              We typically respond within 2&ndash;3 business days.
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <Bug className="w-4 h-4 text-blue-400" /> Bug Reports &amp; Feature Requests
            </h2>
            <p className="mb-2">
              Found a bug or have an idea for a new feature? Email us directly:
            </p>
            <a href="mailto:johnlemargonzales@gmail.com" className="text-blue-400 hover:underline font-medium">
              johnlemargonzales@gmail.com
            </a>
            <p className="text-slate-500 text-xs mt-2">
              Please include &quot;Bug Report&quot; or &quot;Feature Request&quot; in the subject line.
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-400" /> Data &amp; Privacy Requests
            </h2>
            <p className="mb-2">
              For data deletion requests, privacy concerns, or inquiries about your personal data:
            </p>
            <a href="mailto:johnlemargonzales@gmail.com" className="text-blue-400 hover:underline font-medium">
              johnlemargonzales@gmail.com
            </a>
            <p className="text-slate-500 text-xs mt-2">
              Please include &quot;Data Request&quot; in the subject line for faster processing.
            </p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-slate-100 mb-2">Other Resources</h2>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>
                <span className="text-slate-600 ml-1">&mdash; How we handle your data</span>
              </li>
              <li>
                <Link href="/terms" className="text-blue-400 hover:underline">Terms of Service</Link>
                <span className="text-slate-600 ml-1">&mdash; Rules for using Techdle</span>
              </li>
              <li>
                <Link href="/accessibility" className="text-blue-400 hover:underline">Accessibility Statement</Link>
                <span className="text-slate-600 ml-1">&mdash; Our commitment to inclusive design</span>
              </li>
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}
