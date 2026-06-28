"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import Link from 'next/link';
import { LogOut, ExternalLink, Moon, Sun, Monitor, User as UserIcon, Trash2 } from 'lucide-react';
import { clearLocalData } from '@/lib/storage';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import dynamic from 'next/dynamic';

const SignupPromptModal = dynamic(() => import('@/components/SignupPromptModal').then(mod => mod.SignupPromptModal), { ssr: false });

export default function LoginPage() {
  const { user, error, loading } = useAuth();
  
  const [signingOut, setSigningOut] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
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
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="max-w-md mx-auto py-12 px-4 space-y-6">
        
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

              <button
                onClick={() => setIsLogoutModalOpen(true)}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 bg-error/20 hover:bg-error/30 text-error border border-error/30 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        {/* Data Management Section */}
        <div className="bg-surface p-6 rounded-2xl border border-border shadow-xl relative overflow-hidden">
          <h2 className="text-xl font-bold mb-6 text-error flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Data Management
          </h2>
          <div className="space-y-4">
            <div className="text-sm text-text-muted">
              Permanently delete all your local statistics, streaks, and game history on this device.
            </div>
            <button
              onClick={() => setIsClearDataModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-error/20 hover:bg-error/30 text-error border border-error/30 font-bold py-3 px-4 rounded-lg transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              Clear Local Data
            </button>
          </div>
        </div>

        <div className="mt-8 text-center pt-6">
           <Link href="/" className="inline-block text-text-muted hover:text-text-main transition-colors text-sm font-medium">
              Return to Game
           </Link>
        </div>
      </main>

      <SignupPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          
          <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-text-main font-serif mb-2">
              Confirm Logout
            </h2>
            <p className="text-text-muted mb-6 text-sm">
              Are you sure you want to log out? Your progress will remain securely saved to your cloud account.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 bg-surface-raised hover:bg-border text-text-main font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  handleSignOut();
                }}
                className="flex-1 py-2.5 bg-error/20 hover:bg-error/30 text-error border border-error/30 font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div 
            className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => {
              setIsClearDataModalOpen(false);
              setDeleteInput('');
            }}
          />
          
          <div className="relative w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-300">
            <h2 className="text-xl font-bold text-error font-serif mb-2">
              Clear All Data?
            </h2>
            <p className="text-text-muted mb-4 text-sm">
              This will permanently delete your local game history, streaks, and statistics. This action cannot be undone.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-text-main mb-2">
                Type <strong className="text-error">DELETE</strong> to confirm:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-2 focus:ring-error focus:border-error transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsClearDataModalOpen(false);
                  setDeleteInput('');
                }}
                className="flex-1 py-2.5 bg-surface-raised hover:bg-border text-text-main font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={deleteInput !== 'DELETE'}
                onClick={() => {
                  clearLocalData();
                  setIsClearDataModalOpen(false);
                  setDeleteInput('');
                  window.location.reload();
                }}
                className="flex-1 py-2.5 bg-error hover:bg-error/90 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
