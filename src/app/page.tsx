'use client';

import { Header } from '@/components/Header';
import { LandingPage } from '@/components/LandingPage';

export default function Home() {
  return (
    <div className="flex-grow flex flex-col bg-background text-text-main font-sans">
      <Header />
      <main className="relative flex-grow flex flex-col">
        <LandingPage />
      </main>
    </div>
  );
}
