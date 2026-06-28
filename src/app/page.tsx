'use client';

import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage';
import { Header } from '@/components/Header';
import { Game } from '@/components/Game';
import { GameMode } from '@/types/game';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

const HowToPlayModal = dynamic(() => import('@/components/HowToPlayModal').then(mod => mod.HowToPlayModal), { ssr: false });

export default function Home() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [mode, setMode] = useState<GameMode | null>(null);

  const handleGameStart = () => {
    const hasSeenTutorial = safeGetItem('hasSeenTechdleTutorial');
    if (!hasSeenTutorial) {
      setIsHelpOpen(true);
      safeSetItem('hasSeenTechdleTutorial', 'true');
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-background text-text-main font-sans">
      <Header mode={mode} />
      <main className="relative flex-grow flex flex-col">
        {mode && (
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setMode(null)}
              className="p-2 md:p-3 bg-surface border border-border rounded-full shadow-sm text-text-muted hover:text-text-main hover:bg-surface-raised transition-all flex items-center justify-center group"
              title="Return to Menu"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => setIsHelpOpen(true)}
              className="p-2 md:p-3 bg-surface border border-border rounded-full shadow-sm text-text-muted hover:text-text-main hover:bg-surface-raised transition-all flex items-center justify-center group"
              title="How To Play"
            >
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        )}
        <Game mode={mode} onSelectMode={setMode} onTutorialTrigger={handleGameStart} />
      </main>
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
