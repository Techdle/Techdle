import { GameMode } from '../types/game';
import { useDailyGame } from './useDailyGame';
import { useEndlessGame } from './useEndlessGame';
import { useSLATimeAttack } from './useSLATimeAttack';
import { useP1OutageGame } from './useP1OutageGame';

export function useGame(mode: GameMode | null) {
  const daily = useDailyGame();
  const endless = useEndlessGame();
  const sla = useSLATimeAttack();
  const p1 = useP1OutageGame();

  switch (mode) {
    case 'endless': return endless;
    case 'sla-time-attack': return sla;
    case 'p1-outage': return p1;
    default: return daily;
  }
}
