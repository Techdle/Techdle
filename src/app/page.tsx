'use client';

import { useState, useEffect } from 'react';
import { safeGetItem, safeSetItem } from '@/lib/storage';
import { Header } from '@/components/Header';
import { Game } from '@/components/Game';
import { HowToPlayModal } from '@/components/HowToPlayModal';
import { GameMode } from '@/types/game';
import { ArrowLeft } from 'lucide-react';

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
    <div className="min-h-[100dvh] bg-background text-text-main font-sans">
      <Header onOpenHelp={() => setIsHelpOpen(true)} mode={mode} />
      <main className="relative">
        {mode && (
          <button
            onClick={() => setMode(null)}
            className="absolute top-4 left-4 p-2 md:p-3 bg-surface border border-border rounded-full shadow-sm text-text-muted hover:text-text-main hover:bg-surface-raised transition-all z-10 flex items-center justify-center group"
            title="Return to Menu"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}
        <Game mode={mode} onSelectMode={setMode} onTutorialTrigger={handleGameStart} />
      </main>
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
