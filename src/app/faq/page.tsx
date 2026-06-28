import { Header } from '@/components/Header';
import { HelpCircle, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'FAQ - Techdle',
  description: 'Frequently Asked Questions about Techdle, the daily IT troubleshooting game.',
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What time does the daily puzzle reset?",
      answer: "The daily puzzle resets at midnight UTC+8 (which corresponds to 12:00 AM in Beijing, Singapore, Perth, and Philippine Standard Time). For players in the US, this is typically mid-morning or early afternoon depending on daylight saving time."
    },
    {
      question: "What are the different game modes?",
      answer: (
        <div className="space-y-2">
          <p>Techdle offers several ways to test your IT skills:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Daily:</strong> The classic mode. One new puzzle every day for everyone around the world.</li>
            <li><strong>Endless Queue:</strong> Play randomly selected tickets back-to-back. See how high of a streak you can build before getting one wrong!</li>
            <li><strong>SLA Time Attack:</strong> A rapid-fire mode where you must diagnose tickets before the Service Level Agreement (SLA) timer expires.</li>
            <li><strong>P1 Outage:</strong> A high-stakes, higher-difficulty daily puzzle featuring critical severity infrastructure incidents.</li>
            <li><strong>Category Drill:</strong> Want to practice just networking or hardware issues? This mode lets you filter tickets by specific categories.</li>
          </ul>
        </div>
      )
    },
    {
      question: "How does the Answer Dictionary work?",
      answer: "Whenever you complete a puzzle (win or lose), the full details—including the root cause, an explanation, and the standard fix steps—are permanently unlocked in your Answer Dictionary. It acts as your personal IT knowledge base that grows the more you play."
    },
    {
      question: "Do I need an account to play?",
      answer: "No! You can play Techdle completely anonymously without signing up. Your progress, streaks, and dictionary will be saved locally in your browser. However, if you want to sync your progress across multiple devices (like your phone and your computer) or protect against losing your data if you clear your cookies, we highly recommend creating a free account."
    },
    {
      question: "I lost my streak! What happened?",
      answer: "If you were playing anonymously, your streak is saved in your browser's local storage. If you clear your cookies, use incognito mode, or switch to a different browser/device, your streak won't carry over. To prevent this, log in or create an account to back your data up to the cloud."
    },
    {
      question: "How does the guessing system work?",
      answer: "Our system uses fuzzy matching and aliases. You don't have to guess the exact wording! For example, if the root cause is 'DNS Configuration Error', guessing 'DNS', 'Bad DNS', or 'Name Resolution' will all be accepted as correct."
    },
    {
      question: "Can I submit a puzzle idea?",
      answer: (
        <>
          Yes! We love hearing real-world IT nightmares from the community. You can reach out to us via the <Link href="/contact" className="text-primary hover:underline font-bold">Contact page</Link> to share your story. If it's tricky enough, it might be featured as a future puzzle!
        </>
      )
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans">
      <Header />
      <main className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-sm">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-text-main">Frequently Asked Questions</h1>
          <p className="text-xl text-text-muted max-w-xl mx-auto">
            Everything you need to know about playing Techdle, game modes, and accounts.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm transition-colors hover:border-border/80">
              <h2 className="text-xl font-bold text-text-main mb-4 flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                {faq.question}
              </h2>
              <div className="text-text-muted text-lg leading-relaxed pl-6">
                {faq.answer}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-16 pb-12">
          <p className="text-text-muted mb-6">Still have questions?</p>
          <Link href="/contact" className="inline-flex items-center gap-2 justify-center px-8 py-4 bg-surface-raised hover:bg-surface border border-border text-text-main font-bold text-lg rounded-xl transition-all shadow-sm hover:shadow-md">
            Contact Support
          </Link>
        </div>
      </main>
    </div>
  );
}
