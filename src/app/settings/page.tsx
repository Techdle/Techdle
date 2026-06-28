"use client";

import { Header } from '@/components/Header';
import { Settings, LogOut, Trash2, ShieldCheck, AlertCircle, X, Palette, Store, Heart } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { clearLocalData } from '@/lib/storage';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { themes } from '@/lib/themes';
import Link from 'next/link';

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { theme, setTheme, favorites } = useTheme();
  const activeTheme = themes.find(t => t.id === theme) || themes[0];
  const ActiveIcon = activeTheme.icon;
  const favoriteThemesData = favorites.slice(0, 3).map(id => themes.find(t => t.id === id)).filter(Boolean);

  const [signingOut, setSigningOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  const handleSignOut = async () => {
    if (!auth) return;
    setSigningOut(true);
    try {
      clearLocalData();
      await signOut(auth);
      router.replace('/login');
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Settings
          </h1>
          <p className="text-text-muted mt-2">Manage your app preferences and account.</p>
        </div>

        <div className="flex flex-col gap-8">
          
          {/* Theme Settings */}
          <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-md">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Theme
            </h2>
            
            <div className="flex flex-col md:flex-row gap-6">
              {/* Current Look */}
              <div className="flex-1 bg-surface-raised border border-border rounded-2xl p-6 flex flex-col">
                <div className="flex-1">
                  <div className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider flex items-center justify-between">
                    <span>Current Look</span>
                    <span className="bg-surface border border-border px-2 py-1 rounded text-[10px]">{activeTheme.mode}</span>
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden border border-border/50"
                      style={{ background: activeTheme.colors.surface }}
                    >
                      <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${activeTheme.colors.primary}, transparent)` }} />
                      <ActiveIcon className="w-8 h-8 relative z-10" style={{ color: activeTheme.colors.primary }} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-text-main">{activeTheme.name}</h3>
                      <p className="text-text-muted">{activeTheme.description}</p>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2">Palette</div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: activeTheme.colors.background }} title="Background Color" />
                      <div className="w-8 h-8 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: activeTheme.colors.surface }} title="Surface Color" />
                      <div className="w-8 h-8 rounded-full border border-border/50 shadow-sm" style={{ backgroundColor: activeTheme.colors.primary }} title="Primary Color" />
                    </div>
                  </div>
                </div>

                <Link 
                  href="/settings/themes" 
                  className="w-full flex items-center justify-center gap-2 bg-surface border border-border hover:bg-border text-text-main font-bold py-3 px-4 rounded-xl transition-all mt-auto"
                >
                  <Store className="w-5 h-5" />
                  Browse Theme Store
                </Link>
              </div>

              {/* Quick Switch */}
              <div className="w-full md:w-72 bg-surface-raised border border-border rounded-2xl p-6 flex flex-col justify-center">
                <div className="text-xs font-bold text-text-muted mb-4 uppercase tracking-wider flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Quick Favorites
                </div>
                {favoriteThemesData.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {favoriteThemesData.map(favTheme => {
                      if (!favTheme) return null;
                      const FavIcon = favTheme.icon;
                      const isActive = theme === favTheme.id;
                      return (
                        <button 
                          key={favTheme.id}
                          onClick={() => setTheme(favTheme.id)}
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                            isActive ? 'bg-surface border border-primary shadow-sm ring-1 ring-primary' : 'bg-surface border border-border hover:border-text-muted hover:-translate-y-0.5'
                          }`}
                        >
                          <div 
                            className="w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center shadow-inner relative overflow-hidden"
                            style={{ background: favTheme.colors.surface }}
                          >
                            <div className="absolute inset-0 opacity-30" style={{ background: `linear-gradient(135deg, ${favTheme.colors.primary}, transparent)` }} />
                            <FavIcon className="w-5 h-5 relative z-10" style={{ color: favTheme.colors.primary }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm text-text-main leading-tight truncate">{favTheme.name}</div>
                            <div className="text-xs text-text-muted truncate">{favTheme.description}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-text-muted text-center py-8">
                    No favorites yet. <br/>Browse the store to add some!
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Account Details */}
          <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Account Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-main mb-2">
                  Email Address
                </label>
                <input
                  type="text"
                  value={user?.email || 'Not logged in'}
                  disabled
                  className="w-full bg-surface-raised border border-border/50 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed"
                />
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-error/20 shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-error" />
            <h2 className="text-xl font-bold mb-4 text-error flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Danger Zone
            </h2>
            <p className="text-text-muted text-sm mb-6">These actions affect your local data and session. Your cloud statistics will remain safe.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                disabled={signingOut}
                className="w-full flex items-center justify-center gap-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                <LogOut className="w-5 h-5" />
                {signingOut ? 'Signing out...' : 'Sign Out'}
              </button>
              <button
                onClick={() => setIsClearDataModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-error/10 hover:bg-error/20 text-error border border-error/30 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                Clear Local Data
              </button>
            </div>
          </section>

        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 opacity-100">
          <div 
            className="absolute inset-0 bg-background/95 backdrop-blur-sm"
            onClick={() => setIsLogoutModalOpen(false)}
          />
          
          <div className="relative w-full max-w-lg mx-4 bg-surface rounded-2xl border border-border shadow-2xl flex flex-col transition-all duration-300 scale-100 translate-y-0 animate-in zoom-in-95 p-6">
            <button 
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-main hover:bg-surface-raised transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-serif text-text-main mb-2">Ready to log out?</h2>
            <p className="text-text-muted text-sm mb-6">
              Don't worry, your stats are safely backed up to the cloud. You can return and log back in anytime to continue your streak.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                disabled={signingOut}
                className="flex-1 flex items-center justify-center gap-3 bg-surface-raised border border-border hover:bg-border text-text-main font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 shadow-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  handleSignOut();
                }}
                disabled={signingOut}
                className="flex-1 flex items-center justify-center gap-3 bg-error hover:bg-error/90 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 shadow-sm"
              >
                <LogOut className="w-5 h-5" />
                {signingOut ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear Data Confirmation Modal */}
      {isClearDataModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
