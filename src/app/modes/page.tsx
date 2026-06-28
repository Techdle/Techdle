"use client";

import { useState } from 'react';
import { Terminal, Infinity as InfinityIcon, Timer, AlertOctagon, ArrowLeft, FolderGit2, HelpCircle, X } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/Header';

export default function ModesPage() {
  const [infoMode, setInfoMode] = useState<string | null>(null);

  const modeInfo = {
    endless: {
      title: 'The Ticket Queue (Endless)',
      icon: <InfinityIcon className="w-8 h-8 text-primary" />,
      description: 'The ultimate endurance test. Tickets keep coming until you fail one.',
      rules: [
        'You have 6 guesses per ticket.',
        'If you guess correctly, your streak increases by 1.',
        'If you fail a ticket, your streak resets to 0.',
        'See how long you can last!'
      ],
      theme: {
        bg: 'bg-primary/5',
        border: 'border-primary/20',
        text: 'text-primary',
        buttonBg: 'bg-primary hover:bg-primary/90',
        buttonText: 'text-background',
        iconBg: 'bg-primary/10',
        boxBg: 'bg-primary/5'
      }
    },
    sla: {
      title: 'Service Level Agreement (SLA) Time Attack',
      icon: <Timer className="w-8 h-8 text-orange-500" />,
      description: 'Race against the clock! Resolve tickets fast to keep your SLA high.',
      rules: [
        'You start with 60 seconds on the clock.',
        'Correct guess: +15 seconds.',
        'Wrong guess: -5 seconds.',
        'The game ends when time runs out.'
      ],
      theme: {
        bg: 'bg-orange-500/5',
        border: 'border-orange-500/20',
        text: 'text-orange-500',
        buttonBg: 'bg-orange-500 hover:bg-orange-500/90',
        buttonText: 'text-white',
        iconBg: 'bg-orange-500/10',
        boxBg: 'bg-orange-500/5'
      }
    },
    p1: {
      title: 'P1 Outage Mode',
      icon: <AlertOctagon className="w-8 h-8 text-red-500" />,
      description: 'A critical outage! No room for error. Only the best engineers survive.',
      rules: [
        'You only get 3 guesses per ticket instead of 6.',
        'The clues are raw, unfiltered server logs.',
        'Extremely difficult.'
      ],
      theme: {
        bg: 'bg-red-500/5',
        border: 'border-red-500/20',
        text: 'text-red-500',
        buttonBg: 'bg-red-500 hover:bg-red-500/90',
        buttonText: 'text-white',
        iconBg: 'bg-red-500/10',
        boxBg: 'bg-red-500/5'
      }
    },
    category: {
      title: 'Category Drill',
      icon: <FolderGit2 className="w-8 h-8 text-blue-500" />,
      description: 'Focus your training on specific domains of IT.',
      rules: [
        'Choose a category: Hardware, Network, Security, or Software.',
        'All tickets will be from that specific category.',
        'Great for learning and studying specific areas.'
      ],
      theme: {
        bg: 'bg-blue-500/5',
        border: 'border-blue-500/20',
        text: 'text-blue-500',
        buttonBg: 'bg-blue-500 hover:bg-blue-500/90',
        buttonText: 'text-white',
        iconBg: 'bg-blue-500/10',
        boxBg: 'bg-blue-500/5'
      }
    }
  };

  const handleInfoClick = (e: React.MouseEvent, mode: string) => {
    e.preventDefault();
    e.stopPropagation();
    setInfoMode(mode);
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center px-6 animate-in fade-in duration-500 overflow-y-auto pt-8 pb-8">
        <div className="w-full max-w-2xl flex flex-col animate-in zoom-in-95 duration-700 delay-150 fill-mode-both mx-auto">
        
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text-main transition-colors mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Daily Game
            </Link>
            <div className="flex items-center gap-4">
            <div className="bg-surface border border-border p-4 rounded-2xl shadow-xl">
              <Terminal className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-text-main tracking-tight font-serif">
                Other Gamemodes
              </h1>
              <p className="text-text-muted mt-1">Play specialized Techdle experiences.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 w-full mb-12">
          {/* Endless Mode */}
          <Link
            href="/modes/endless"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-primary rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-primary/10 transition-colors">
              <InfinityIcon className="w-8 h-8 text-primary transition-colors" />
            </div>
            <div className="pr-12">
              <span className="block font-bold text-text-main text-xl mb-1">The Ticket Queue (Endless)</span>
              <span className="block text-sm text-text-muted">Unlimited play & streak tracking. Clear tickets as long as you can.</span>
            </div>
            <div 
              onClick={(e) => handleInfoClick(e, 'endless')}
              className="absolute right-0 top-0 bottom-0 w-16 bg-surface border-l border-border flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out hover:bg-surface-raised hover:text-primary text-text-muted"
            >
              <HelpCircle className="w-6 h-6" />
            </div>
          </Link>

          {/* SLA Time Attack */}
          <Link
            href="/modes/sla-time-attack"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-orange-500 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-orange-500/10 transition-colors">
              <Timer className="w-8 h-8 text-orange-500 transition-colors" />
            </div>
            <div className="pr-12">
              <span className="block font-bold text-text-main text-xl mb-1">Service Level Agreement (SLA) Time Attack</span>
              <span className="block text-sm text-text-muted">60s clock. Correct guesses add 15s. Wrong guesses subtract 5s.</span>
            </div>
            <div 
              onClick={(e) => handleInfoClick(e, 'sla')}
              className="absolute right-0 top-0 bottom-0 w-16 bg-surface border-l border-border flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out hover:bg-surface-raised hover:text-orange-500 text-text-muted"
            >
              <HelpCircle className="w-6 h-6" />
            </div>
          </Link>

          {/* P1 Outage */}
          <Link
            href="/modes/p1-outage"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-red-500 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-red-500/10 transition-colors">
              <AlertOctagon className="w-8 h-8 text-red-500 transition-colors" />
            </div>
            <div className="pr-12">
              <span className="block font-bold text-text-main text-xl mb-1">P1 Outage Mode</span>
              <span className="block text-sm text-text-muted">3 guesses only. Read raw server crash logs. Hard mode.</span>
            </div>
            <div 
              onClick={(e) => handleInfoClick(e, 'p1')}
              className="absolute right-0 top-0 bottom-0 w-16 bg-surface border-l border-border flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out hover:bg-surface-raised hover:text-red-500 text-text-muted"
            >
              <HelpCircle className="w-6 h-6" />
            </div>
          </Link>

          {/* Category Drill */}
          <Link
            href="/modes/category"
            className="flex items-center p-6 bg-surface hover:bg-surface-raised border border-border border-l-4 border-l-blue-500 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] group relative overflow-hidden"
          >
            <div className="p-4 bg-surface-raised rounded-xl mr-6 group-hover:bg-blue-500/10 transition-colors">
              <FolderGit2 className="w-8 h-8 text-blue-500 transition-colors" />
            </div>
            <div className="pr-12">
              <span className="block font-bold text-text-main text-xl mb-1">Category Drill</span>
              <span className="block text-sm text-text-muted">Choose Hardware, Network, Security, or Software and drill tickets endlessly.</span>
            </div>
            <div 
              onClick={(e) => handleInfoClick(e, 'category')}
              className="absolute right-0 top-0 bottom-0 w-16 bg-surface border-l border-border flex items-center justify-center translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out hover:bg-surface-raised hover:text-blue-500 text-text-muted"
            >
              <HelpCircle className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>
      </main>

      {/* Info Modal */}
      {infoMode && modeInfo[infoMode as keyof typeof modeInfo] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setInfoMode(null)}
          />
          <div className={`relative w-full max-w-lg bg-surface border ${modeInfo[infoMode as keyof typeof modeInfo].theme.border} rounded-2xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 overflow-hidden`}>
            
            {/* Background Tint */}
            <div className={`absolute inset-0 ${modeInfo[infoMode as keyof typeof modeInfo].theme.bg} pointer-events-none`} />

            <button 
              onClick={() => setInfoMode(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-surface-raised transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl border ${modeInfo[infoMode as keyof typeof modeInfo].theme.border} ${modeInfo[infoMode as keyof typeof modeInfo].theme.iconBg}`}>
                  {modeInfo[infoMode as keyof typeof modeInfo].icon}
                </div>
                <h2 className="text-2xl font-bold text-text-main">
                  {modeInfo[infoMode as keyof typeof modeInfo].title}
                </h2>
              </div>
              <p className="text-text-muted mb-6 leading-relaxed">
                {modeInfo[infoMode as keyof typeof modeInfo].description}
              </p>
              <div className={`rounded-xl p-5 border ${modeInfo[infoMode as keyof typeof modeInfo].theme.border} ${modeInfo[infoMode as keyof typeof modeInfo].theme.boxBg} mb-6`}>
                <h3 className="font-bold text-text-main mb-4 uppercase tracking-wider text-xs">How to Play</h3>
                <ul className="space-y-3">
                  {modeInfo[infoMode as keyof typeof modeInfo].rules.map((rule, i) => (
                    <li key={i} className="flex gap-3 text-sm text-text-muted">
                      <span className={`${modeInfo[infoMode as keyof typeof modeInfo].theme.text} font-bold shrink-0`}>{i + 1}.</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={() => setInfoMode(null)}
                className={`w-full py-4 ${modeInfo[infoMode as keyof typeof modeInfo].theme.buttonBg} ${modeInfo[infoMode as keyof typeof modeInfo].theme.buttonText} font-bold rounded-xl transition-all shadow-sm`}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
