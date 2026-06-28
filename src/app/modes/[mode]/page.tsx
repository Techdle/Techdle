'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage';
import dynamic from 'next/dynamic';
import { Game } from '@/components/Game';
import { Header } from '@/components/Header';
import { GameMode } from '@/types/game';
import { ArrowLeft } from 'lucide-react';

const HowToPlayModal = dynamic(() => import('@/components/HowToPlayModal').then(mod => mod.HowToPlayModal), { ssr: false });

export default function ModePage() {
  const params = useParams();
  const router = useRouter();
  const mode = params.mode as GameMode;
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const validModes: GameMode[] = ['daily', 'endless', 'sla-time-attack', 'p1-outage', 'category'];
  
  if (!validModes.includes(mode)) {
    // If invalid mode, push back to modes index
    if (typeof window !== 'undefined') {
      router.push('/modes');
    }
    return null;
  }

  const handleGameStart = () => {
    const hasSeenTutorial = safeGetItem('hasSeenTechdleTutorial');
    if (!hasSeenTutorial) {
      setIsHelpOpen(true);
      safeSetItem('hasSeenTechdleTutorial', 'true');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans flex flex-col">
      <Header mode={mode} />
      <main className="relative flex-grow">
        <button
          onClick={() => router.push('/modes')}
          className="absolute top-4 left-4 p-2 md:p-3 bg-surface border border-border rounded-full shadow-sm text-text-muted hover:text-text-main hover:bg-surface-raised transition-all z-10 flex items-center justify-center group"
          title="Return to Modes"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <Game mode={mode} onSelectMode={() => {}} onTutorialTrigger={handleGameStart} />
      </main>
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
