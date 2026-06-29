"use client";

import { BellRing } from 'lucide-react';
import { useContext } from 'react';
import { WhatsNewContext } from './WhatsNewProvider';

export function WhatsNewFloatingButton() {
  const { latestRelease, openModal } = useContext(WhatsNewContext);

  if (!latestRelease) return null;

  return (
    <button
      onClick={openModal}
      className="fixed bottom-6 right-6 p-4 bg-primary text-background rounded-full shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all z-40 group flex items-center justify-center"
      aria-label="What's New"
      title="What's New"
    >
      <BellRing className="w-6 h-6 fill-current animate-in spin-in-12 duration-700" />
    </button>
  );
}
