"use client";

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/components/AuthProvider';
import { loadUserDocument, updateDisplayName, clearLocalData } from '@/lib/storage';
import { UserDocument } from '@/types/game';
import { User, ShieldCheck, CheckCircle2, AlertCircle, Calendar, Target, Trophy, Clock, BarChart2, Archive } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { StatsView } from '@/components/StatsView';
import { ArchiveView } from '@/components/ArchiveView';
import { getTodayDateString } from '@/lib/date';
import { loadGameState } from '@/lib/storage';
import { GameState } from '@/types/game';
import { auth } from '@/lib/firebase';
import dynamic from 'next/dynamic';

const SignupPromptModal = dynamic(() => import('@/components/SignupPromptModal').then(mod => mod.SignupPromptModal), { ssr: false });

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [userDoc, setUserDoc] = useState<UserDocument | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [initialName, setInitialName] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [todayState, setTodayState] = useState<GameState | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'archive'>('stats');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);



  useEffect(() => {
    if (loading) return;

    async function loadData() {
      try {
        if (user && !user.isAnonymous) {
          const doc = await loadUserDocument(user.uid);
          setUserDoc(doc);
          if (doc?.displayName) {
            setDisplayName(doc.displayName);
            setInitialName(doc.displayName);
          }
        }
        
        const state = loadGameState();
        const todayStr = getTodayDateString();
        if (state && state.date === todayStr && state.status !== 'playing') {
          setTodayState(state);
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsDataLoaded(true);
      }
    }
    
    loadData();
  }, [user, loading, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmed = displayName.trim();
    if (trimmed.length < 3) {
      setError("Display name must be at least 3 characters.");
      return;
    }
    if (trimmed.length > 20) {
      setError("Display name must be under 20 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      setError("Display name can only contain letters, numbers, underscores, and dashes.");
      return;
    }

    if (!user) return;

    setIsSaving(true);
    try {
      await updateDisplayName(user.uid, trimmed);
      setInitialName(trimmed);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again later.");
    } finally {
      setIsSaving(false);
    }
  };


  if (loading || !isDataLoaded) {
    return (
      <div className="min-h-[100dvh] bg-background text-text-main font-sans">
        <Header />
        <div className="flex justify-center items-center h-64 text-text-muted">Loading...</div>
      </div>
    );
  }

  const isChanged = displayName.trim() !== initialName;
  const stats = userDoc?.stats;
  
  // Parse history strings `${puzzleId}:${date}:${status}:${guessCount}`
  const rawHistory = userDoc?.history || [];
  const parsedHistory = rawHistory.map(entry => {
    const [puzzleId, date, status, guessesCount] = entry.split(':');
    return { puzzleId, date, status, guessesCount: parseInt(guessesCount, 10) || 0 };
  });

  const winRate = stats && stats.totalPlayed > 0 
    ? Math.round((stats.wins / stats.totalPlayed) * 100) 
    : 0;

  // For Guess Distribution Chart
  const distribution = stats?.guessDistribution || { 1:0, 2:0, 3:0, 4:0, 5:0, 6:0, loss:0 };
  const maxGuessCount = Math.max(...Object.values(distribution).filter(v => typeof v === 'number')) || 1;

  return (
    <>
      <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
        <Header />
        <main className="w-full max-w-[1400px] mx-auto px-4 xl:px-8 py-8 md:py-12 animate-in fade-in">
          
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary">Player Dashboard</h1>
            <p className="text-text-muted mt-2">Manage your identity and track your legendary Techdle stats.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR: Identity & Danger Zone */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
              
              {/* Profile Edit Card */}
              <div className="bg-surface p-6 sm:p-8 rounded-2xl border border-border shadow-xl">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20 shadow-sm mb-4">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">{initialName || 'Anonymous Player'}</h2>
                  <p className="text-text-muted text-sm mt-1">Joined {(!user || user.isAnonymous) ? 'Recently' : user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Recently'}</p>
                </div>

                {(!user || user.isAnonymous) ? (
                  <div className="space-y-4 pt-4 border-t border-border">
                    <div className="text-text-muted text-sm text-center">
                      Log in or sign up to set a display name and permanently save your stats across devices.
                    </div>
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm"
                    >
                      <User className="w-5 h-5" />
                      Sync Your Progress
                    </button>
                  </div>
                ) : (
                <form onSubmit={handleSave} className="space-y-5">
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-bold text-text-main mb-2">
                      Display Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. ServerAdmin99"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-text-main focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all font-mono"
                      maxLength={20}
                    />
                    <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Visible on Leaderboards
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-text-main mb-2">
                      Email Address
                    </label>
                    <input
                      type="text"
                      value={user?.email || 'Linked Google Account'}
                      disabled
                      className="w-full bg-surface-raised border border-border/50 rounded-xl px-4 py-3 text-text-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-success" />
                      Strictly private and hidden
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 bg-error/10 border border-error/20 rounded-lg flex items-start gap-2 text-error text-sm">
                      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg flex items-center gap-2 text-success text-sm">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Profile updated!</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!isChanged || isSaving}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-surface-raised disabled:text-text-muted text-background font-bold py-3.5 px-4 rounded-xl transition-all disabled:opacity-50 shadow-sm"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
                )}
              </div>


            </div>

            {/* MAIN CONTENT: Tabs for Stats & History */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
              
              {/* Tab Navigation */}
              <div className="bg-surface p-2 rounded-2xl border border-border shadow-md flex gap-2">
                <button
                  onClick={() => setActiveTab('stats')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'stats' ? 'bg-primary text-background shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface-raised'}`}
                >
                  <BarChart2 className="w-5 h-5" />
                  Detailed Stats
                </button>
                <button
                  onClick={() => setActiveTab('archive')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all ${activeTab === 'archive' ? 'bg-primary text-background shadow-md' : 'text-text-muted hover:text-text-main hover:bg-surface-raised'}`}
                >
                  <Archive className="w-5 h-5" />
                  Game Archive
                </button>
              </div>

              {/* Tab Content */}
              <div className="bg-surface rounded-2xl border border-border shadow-xl p-6 overflow-hidden min-h-[500px]">
                {activeTab === 'stats' ? (
                  <StatsView todayState={todayState} />
                ) : (
                  <ArchiveView />
                )}
              </div>

            </div>
          </div>
        </main>

      </div>
      <SignupPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
