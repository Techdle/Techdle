import Link from 'next/link';
import { AdBanner } from './AdBanner';

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto text-center z-10 relative">
      <div className="w-full max-w-4xl mx-auto px-4 mb-8">
        <AdBanner dataAdSlot="REPLACE_WITH_SLOT_ID_2" />
        <p className="text-[11px] text-text-muted/60 mt-4 max-w-xl mx-auto italic leading-relaxed">
          Techdle is kept free and online thanks to these ads covering server costs.
          Since we&apos;re all IT here, I completely respect if you need to use an ad blocker! 🛡️
        </p>
      </div>
      <div className="flex items-center justify-center gap-x-4 text-xs text-text-muted font-medium flex-wrap mx-auto px-4">
        <Link href="/changelog" className="hover:text-text-muted transition-colors whitespace-nowrap">Release Notes</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/privacy" className="hover:text-text-muted transition-colors whitespace-nowrap">Privacy Policy</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/terms" className="hover:text-text-muted transition-colors whitespace-nowrap">Terms of Service</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/cookies" className="hover:text-text-muted transition-colors whitespace-nowrap">Cookie Policy</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/accessibility" className="hover:text-text-muted transition-colors whitespace-nowrap">Accessibility</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/about" className="hover:text-text-muted transition-colors whitespace-nowrap">About</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/faq" className="hover:text-text-muted transition-colors whitespace-nowrap">FAQ</Link>
        <span className="text-border shrink-0">&bull;</span>
        <Link href="/contact" className="hover:text-text-muted transition-colors whitespace-nowrap">Contact</Link>
      </div>
      <div className="mt-2 text-[10px] text-text-muted">
        &copy; {new Date().getFullYear()} Techdle. All rights reserved.
      </div>
    </footer>
  );
}
