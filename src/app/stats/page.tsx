"use client";

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { loadGameState } from '@/lib/storage';
import { GameState } from '@/types/game';
import { getTodayDateString } from '@/lib/date';
import { StatsView } from '@/components/StatsView';
import { AdBanner } from '@/components/AdBanner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function StatsPage() {
  const [todayState, setTodayState] = useState<GameState | null>(null);
  const isXlScreen = useMediaQuery('(min-width: 1280px)');

  useEffect(() => {
    const state = loadGameState();
    const todayStr = getTodayDateString();
    if (state && state.date === todayStr && state.status !== 'playing') {
      setTodayState(state);
    }
  }, []);

  return (
    <div className="min-h-[100dvh] font-sans flex flex-col">
      <Header />
      <main className="w-full mx-auto flex justify-between items-stretch gap-8 px-4 xl:px-12 2xl:px-24 py-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
        
        {/* Left Ad Gutter */}
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-8 h-[600px]">
            {isXlScreen && <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_LEFT" orientation="vertical" />}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-5xl flex flex-col">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-main">Your Stats</h2>
            <p className="text-text-muted mt-2">All-time performance</p>
          </div>
          
          <StatsView todayState={todayState} />
        </div>

        {/* Right Ad Gutter */}
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-8 h-[600px]">
            {isXlScreen && <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_RIGHT" orientation="vertical" />}
          </div>
        </div>
      </main>
    </div>
  );
}
