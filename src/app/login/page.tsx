"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import Link from 'next/link';
import { ExternalLink, Moon, Sun, Monitor, User as UserIcon } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import dynamic from 'next/dynamic';

const SignupPromptModal = dynamic(() => import('@/components/SignupPromptModal').then(mod => mod.SignupPromptModal), { ssr: false });

export default function LoginPage() {
  const { user, error, loading } = useAuth();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="w-full mx-auto flex flex-col items-center gap-8 px-4 py-12">
        
        {/* Main Content */}
        <div className="w-full max-w-md flex flex-col gap-6">
          
          {/* Settings Section */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-text-muted">Toggle dark/light mode</div>
              </div>
              <div className="flex bg-background rounded-lg p-1 border border-border">
                <ThemeSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6">
            Account
          </h2>



          {error && (
            <div className="mb-6 p-3 bg-error/30 border border-error/50 rounded-lg text-error text-sm animate-in fade-in">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-text-muted py-4">Loading...</div>
          ) : (!user || user.isAnonymous) ? (
            <div className="space-y-4">
              <div className="text-text-muted text-sm">
                Log in or sign up to permanently save your stats across devices.
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-primary-hover hover:bg-primary-hover text-text-main font-bold py-3 px-4 rounded-lg transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                Sync Your Progress
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-success/90 text-sm bg-success/20 p-4 rounded-lg border border-success/50">
                <div className="font-bold text-success mb-1">Logged In</div>
                <div className="text-success truncate">{user.email || 'Linked Google Account'}</div>
              </div>

              <Link
                href="/profile"
                className="w-full flex items-center justify-center gap-2 bg-surface-raised hover:bg-surface border border-border text-text-main font-bold py-3 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <UserIcon className="w-5 h-5 text-primary" />
                Go to Profile Dashboard
              </Link>
            </div>
          )}
        </div>

          <div className="mt-8 text-center pt-6">
             <Link href="/" className="inline-block text-text-muted hover:text-text-main transition-colors text-sm font-medium">
                Return to Game
             </Link>
          </div>
        </div>
      </main>

      <SignupPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
