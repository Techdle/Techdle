"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { Bug, LogOut, ExternalLink, Moon, Sun, Monitor, User as UserIcon } from 'lucide-react';
import { clearLocalData } from '@/lib/storage';
import { useSettings } from '@/components/SettingsProvider';
import { useTheme } from 'next-themes';
import { AuthModal } from '@/components/AuthModal';

export default function LoginPage() {
  const { user, error, loading, isDevMode } = useAuth();
  const { highContrast, setHighContrast } = useSettings();
  const { theme, setTheme } = useTheme();
  
  const [signingOut, setSigningOut] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    if (!auth) return;
    setSigningOut(true);
    try {
      clearLocalData();
      await signOut(auth);
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-12">
      <Header />
      <main className="max-w-md mx-auto py-12 px-4 space-y-6">
        
        {/* Settings Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Settings
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">High Contrast Mode</div>
                <div className="text-sm text-slate-400">Improve color visibility</div>
              </div>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${highContrast ? 'bg-blue-500' : 'bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            <div className="border-t border-slate-800 pt-6 flex items-center justify-between">
              <div>
                <div className="font-medium">Theme</div>
                <div className="text-sm text-slate-400">Select application theme</div>
              </div>
              <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-md transition-colors ${mounted && theme === 'light' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Light Theme"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-md transition-colors ${mounted && theme === 'dark' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
                  title="Dark Theme"
                >
                  <Moon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setTheme('system')}
                  className={`p-1.5 rounded-md transition-colors ${mounted && theme === 'system' ? 'bg-slate-800 text-slate-100' : 'text-slate-500 hover:text-slate-300'}`}
                  title="System Theme"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6">
            Account
          </h2>

          {isDevMode && (
            <div className="mb-6 flex items-center justify-center gap-2 text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
              <Bug className="w-4 h-4" />
              Dev Mode Active
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-900/30 border border-red-900/50 rounded-lg text-red-400 text-sm animate-in fade-in">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center text-slate-500 py-4">Loading...</div>
          ) : (!user || user.isAnonymous) ? (
            <div className="space-y-4">
              <div className="text-slate-400 text-sm">
                Log in or sign up to permanently save your stats across devices.
              </div>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                <UserIcon className="w-5 h-5" />
                Sync Your Progress
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-green-400/90 text-sm bg-green-900/20 p-4 rounded-lg border border-green-900/50">
                <div className="font-bold text-green-400 mb-1">Logged In</div>
                <div className="text-green-500/70 truncate">{user.email || 'Linked Google Account'}</div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 text-center pt-6">
           <Link href="/" className="inline-block text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Return to Game
           </Link>
        </div>
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}
