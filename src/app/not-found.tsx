import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center shadow-lg">
          <div className="flex justify-center mb-6 text-error">
            <AlertTriangle className="w-16 h-16 opacity-90" />
          </div>
          
          <h1 className="text-5xl font-bold font-serif mb-2 text-text-main">
            404
          </h1>
          <h2 className="text-xl font-bold mb-6 text-primary tracking-wide uppercase">
            Ticket Not Found
          </h2>
          
          <div className="bg-background border border-border rounded-lg p-4 mb-8 text-left font-mono text-sm text-text-muted overflow-x-auto shadow-inner">
            <div className="flex items-center gap-2 mb-2 border-b border-border pb-2">
              <div className="w-3 h-3 rounded-full bg-error/80"></div>
              <div className="w-3 h-3 rounded-full bg-warning/80"></div>
              <div className="w-3 h-3 rounded-full bg-success/80"></div>
              <span className="ml-2 text-xs opacity-70">bash</span>
            </div>
            <p className="mb-1"><span className="text-error font-bold">ERROR:</span> RESOURCE_NOT_FOUND</p>
            <p className="mb-1">DETAILS: The requested URL was not found on this server.</p>
            <p className="text-primary mt-2 animate-pulse">&gt; Please check the URL or return to base._</p>
          </div>
          
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </>
  );
}
