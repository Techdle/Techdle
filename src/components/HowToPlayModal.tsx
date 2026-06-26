import { X, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect } from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlayModal({ isOpen, onClose }: HowToPlayModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-8 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="w-8" /> {/* Spacer for centering title */}
          <h2 className="text-xl font-bold text-text-main font-serif">How To Play</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-surface-raised transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
          <p className="text-text-muted mb-4 font-medium text-lg">
            Diagnose and close the IT ticket in 6 tries.
          </p>
          
          <ul className="space-y-2 text-text-muted list-disc list-inside mb-6">
            <li>Read the initial user-reported symptom.</li>
            <li>Submit your guess for what the underlying root cause is (e.g. <span className="font-mono text-text-muted">corrupt user profile</span>).</li>
            <li>If your guess is incorrect, a <strong>new clue</strong> will be revealed.</li>
            <li>Solve the ticket before escalating!</li>
          </ul>
          
          <div className="border-t border-border pt-6 mb-6">
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-4">Examples</h3>
            
            <div className="space-y-4">
              <div className="bg-background/50 border border-border p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-error/20 text-error p-1 rounded">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-text-muted font-bold block line-through decoration-error/50">dead motherboard</span>
                    <span className="text-text-muted text-sm">Incorrect guess. Unlocks Clue #2.</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-background/50 border border-border p-3 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="bg-success/20 text-success p-1 rounded">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-text-muted font-bold block">failing power supply</span>
                    <span className="text-text-muted text-sm">Correct! The ticket is closed.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border pt-6 text-sm text-text-muted">
            A new ticket is assigned every day at midnight.
          </div>
        </div>
      </div>
    </div>
  );
}
