"use client";

import { useEffect, useState } from 'react';
import { X, Loader2, Terminal } from 'lucide-react';
import Link from 'next/link';
import { safeSetItem } from '../lib/storage';
import { useAuth } from './AuthProvider';

interface SignupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignupPromptModal({ isOpen, onClose }: SignupPromptModalProps) {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [authInProgress, setAuthInProgress] = useState(false);
  const { user, linkAccount, loginWithGoogle, error } = useAuth();

  if (isOpen && !isRendered) {
    setIsRendered(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen && !isRendered) return null;

  const handleDismiss = () => {
    safeSetItem('hasSeenSignupPrompt', 'true');
    onClose();
  };

  const handleGoogleAuth = async () => {
    setAuthInProgress(true);
    if (user?.isAnonymous) {
      await linkAccount();
    } else {
      await loginWithGoogle();
    }
    setAuthInProgress(false);
    if (!error) handleDismiss();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      <div className={`relative w-full max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto sm:rounded-2xl border border-border shadow-2xl flex flex-col md:flex-row transition-all duration-300 ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        
        {/* Close Button - positioned absolutely to cover both sides but visually on the right */}
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-surface-raised transition-colors md:bg-transparent bg-background/80 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Graphic and Text */}
        <div className="bg-surface w-full md:w-5/12 p-8 sm:p-10 flex flex-col justify-center items-center text-center relative border-b md:border-b-0 md:border-r border-border shrink-0">
          <div className="w-16 h-16 bg-surface-raised border border-border rounded-2xl flex items-center justify-center mb-8 shadow-sm relative">
            <Terminal className="w-8 h-8 text-primary relative z-10" />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-serif text-text-main mb-4 leading-tight">
            Create a free account to track your stats
          </h2>
          <p className="text-text-muted text-sm sm:text-base mb-8 max-w-[280px]">
            Secure your progress and ensure your daily ticket history is never lost.
          </p>

          {/* GitHub-style Heatmap Graphic */}
          <div className="flex gap-1.5 p-4 bg-background border border-border rounded-xl shadow-inner rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
            {[...Array(6)].map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1.5">
                {[...Array(7)].map((_, dayIdx) => {
                  // Fixed pattern to look like an active user streak
                  const val = [
                    [0, 1, 0, 2, 3, 4, 1],
                    [1, 2, 0, 4, 3, 1, 0],
                    [0, 0, 2, 3, 4, 4, 2],
                    [2, 3, 4, 1, 0, 2, 3],
                    [4, 4, 3, 2, 1, 0, 4],
                    [1, 0, 3, 4, 4, 2, 1]
                  ][weekIdx][dayIdx];
                  
                  const bgClass = val === 0 ? 'bg-surface-raised' :
                                  val === 1 ? 'bg-primary/30' :
                                  val === 2 ? 'bg-primary/50' :
                                  val === 3 ? 'bg-primary/80' : 'bg-primary';
                                  
                  return <div key={dayIdx} className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm ${bgClass}`} />
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Form Area */}
        <div className="bg-background w-full md:w-7/12 p-8 sm:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            
            {error && (
              <div className="mb-8 p-3 bg-error/20 border border-error/50 rounded-lg text-error text-sm text-center">
                {error}
              </div>
            )}

            <p className="text-text-muted text-center mb-8">
              Sign in with your Google account to get started. It&apos;s fast, free, and secure.
            </p>

            <button
              onClick={handleGoogleAuth}
              disabled={authInProgress}
              className="w-full flex items-center justify-center gap-3 bg-surface border border-border hover:bg-surface-raised text-text-main font-bold py-4 px-4 rounded-xl transition-all disabled:opacity-50 shadow-sm mb-6"
            >
              {authInProgress ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>

            <p className="text-xs text-center text-text-muted leading-relaxed max-w-[280px] mx-auto">
              By continuing, you agree to the{' '}
              <Link href="/terms" className="underline hover:text-text-main transition-colors">Terms of Service</Link> and{' '}
              <Link href="/privacy" className="underline hover:text-text-main transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
