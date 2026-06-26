import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto text-center z-10 relative">
      <div className="flex items-center justify-center gap-x-4 text-xs text-text-muted font-medium flex-wrap mx-auto px-4">
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
        <Link href="/contact" className="hover:text-text-muted transition-colors whitespace-nowrap">Contact</Link>
      </div>
      <div className="mt-2 text-[10px] text-text-muted">
        &copy; {new Date().getFullYear()} Techdle. All rights reserved.
      </div>
    </footer>
  );
}
