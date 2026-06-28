"use client";

import { GameMode } from '../types/game';
import { DailyGame } from './DailyGame';
import { EndlessGame } from './EndlessGame';
import { SLAGame } from './SLAGame';
import { P1Game } from './P1Game';
import { CategoryGame } from './CategoryGame';

interface GameProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onTutorialTrigger?: () => void;
}

export function Game({ mode, onSelectMode, onTutorialTrigger }: GameProps) {

  switch (mode) {
    case 'endless': return <EndlessGame />;
    case 'sla-time-attack': return <SLAGame />;
    case 'p1-outage': return <P1Game />;
    case 'category': return <CategoryGame />;
    case 'daily':
    default: return <DailyGame onTutorialTrigger={onTutorialTrigger} />;
  }
}

