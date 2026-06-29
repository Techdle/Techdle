"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { GitHubRelease } from '@/lib/github';
import { WhatsNewModal } from './WhatsNewModal';

interface WhatsNewContextType {
  latestRelease: GitHubRelease | null;
  openModal: () => void;
}

export const WhatsNewContext = createContext<WhatsNewContextType>({
  latestRelease: null,
  openModal: () => {},
});

export function useWhatsNew() {
  return useContext(WhatsNewContext);
}

export function WhatsNewProvider({ children }: { children: React.ReactNode }) {
  const [latestRelease, setLatestRelease] = useState<GitHubRelease | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetch('/api/releases')
      .then((res) => (res.ok ? res.json() : []))
      .then((releases: GitHubRelease[]) => {
        if (releases.length > 0) setLatestRelease(releases[0]);
      })
      .catch(() => {}); // ponytail: silent fail — bell button just won't appear
  }, []);

  return (
    <WhatsNewContext.Provider
      value={{ latestRelease, openModal: () => setIsOpen(true) }}
    >
      {children}
      {latestRelease && (
        <WhatsNewModal
          release={latestRelease}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onAcknowledge={() => setIsOpen(false)}
          showAllLink={true}
        />
      )}
    </WhatsNewContext.Provider>
  );
}
