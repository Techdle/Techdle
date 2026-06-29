import { Header } from '@/components/Header';
import { Changelog } from '@/components/Changelog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog | Techdle',
  description: 'Recent updates and improvements to Techdle.',
};

export default function ChangelogPage() {
  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary">
            Release Notes
          </h1>
          <p className="text-text-muted mt-2">All updates, improvements, and new features.</p>
        </div>
        
        {/* We use the Changelog component to render the full history */}
        <Changelog isFullPage={true} />
      </main>
    </div>
  );
}
