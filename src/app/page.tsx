'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Game } from '@/components/Game';
import { DevPuzzleGenerator } from '@/components/DevPuzzleGenerator';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Header onOpenHelp={() => setIsHelpOpen(true)} />
      <main>
        <Game onTutorialTrigger={handleGameStart} />
      </main>
      <HowToPlayModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <DevPuzzleGenerator />
    </div>
  );
}
