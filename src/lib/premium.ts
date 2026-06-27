import { GameMode } from '../types/game';

export function isPremiumFeature(mode: GameMode): boolean {
  return mode === 'endless';
}

export async function canAccessMode(mode: GameMode): Promise<boolean> {
  if (!isPremiumFeature(mode)) return true;
  // TODO: Check Firebase user doc for premium flag
  // return true for now (unlocked for everyone until billing is implemented)
  return true;
}
