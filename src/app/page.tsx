'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Game } from '@/components/Game';
import { HowToPlayModal } from '@/components/HowToPlayModal';

export default function Home() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleGameStart = () => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTechdleTutorial');
    if (!hasSeenTutorial) {
      setIsHelpOpen(true);
      localStorage.setItem('hasSeenTechdleTutorial', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-main font-sans">
      <Header onOpenHelp={() => setIsHelpOpen(true)} />
      <main>
        <Game onTutorialTrigger={handleGameStart} />
      </main>
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}
