"use client";

import { Header } from '@/components/Header';
import { ArchiveView } from '@/components/ArchiveView';
import { AdBanner } from '@/components/AdBanner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function ArchivePage() {
  const isXlScreen = useMediaQuery('(min-width: 1280px)');

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans flex flex-col">
      <Header />
      <main className="w-full mx-auto flex justify-between items-stretch gap-8 px-4 xl:px-12 2xl:px-24 py-8">
        
        {/* Left Ad Gutter */}
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-8 h-[600px]">
            {isXlScreen && <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_LEFT" orientation="vertical" />}
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full max-w-4xl flex flex-col">
          <h2 className="text-3xl font-bold mb-8 text-text-main">Archive</h2>
          <ArchiveView />
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
