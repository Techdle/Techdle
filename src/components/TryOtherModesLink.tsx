import Link from 'next/link';
import { Gamepad2 } from 'lucide-react';

export function TryOtherModesLink() {
  return (
    <Link 
      href="/modes"
      className="flex items-center gap-2 px-6 py-3 bg-surface hover:bg-surface-raised border border-border text-text-main font-bold rounded-lg transition-colors w-full sm:w-auto justify-center"
    >
      <Gamepad2 className="w-5 h-5 text-primary" />
      Try Other Gamemodes
    </Link>
  );
}
