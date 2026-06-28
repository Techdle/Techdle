"use client";

import { useEffect, useState } from 'react';
import { loadUserStats, validateAndRepairStats, saveUserStats, loadArchiveResults, loadEndlessHighScore } from '@/lib/storage';
import { UserStats, ArchiveResult, GameState } from '@/types/game';
import { getTodayDateString } from '@/lib/date';
import { Gamepad2, Trophy, Flame, Zap, Share2, ArrowRight, Target, Award } from 'lucide-react';
import { CountUp } from '@/components/CountUp';
import Link from 'next/link';
import { HeatmapGraph } from '@/components/HeatmapGraph';

export function StatsView({ todayState }: { todayState?: GameState | null }) {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [archiveResults, setArchiveResults] = useState<ArchiveResult[]>([]);
  const [endlessHighScore, setEndlessHighScore] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const rawStats = loadUserStats();
    const cleaned = validateAndRepairStats(rawStats);
    if (JSON.stringify(cleaned) !== JSON.stringify(rawStats)) {
      saveUserStats(cleaned);
    }
    setStats(cleaned);
    setArchiveResults(loadArchiveResults());
    setEndlessHighScore(loadEndlessHighScore());
  }, []);

  const handleShare = async () => {
    if (!stats) return;
    const winRate = stats.totalPlayed === 0 ? 0 : Math.round((stats.wins / stats.totalPlayed) * 100);
    const totalGuessesInWins = Object.entries(stats.guessDistribution)
      .filter(([k]) => k !== 'loss')
      .reduce((sum, [k, v]) => sum + (parseInt(k) * v), 0);
    const averageGuesses = stats.wins === 0 ? 0 : Number((totalGuessesInWins / stats.wins).toFixed(2));
    const avgText = averageGuesses > 0 ? `\n🎯 Avg Guesses: ${averageGuesses}` : '';
    const text = `Techdle Stats\n🎮 Played: ${stats.totalPlayed}\n🏆 Win Rate: ${winRate}%\n⭐ Total Wins: ${stats.wins}\n🔥 Current Streak: ${stats.currentStreak}\n⚡ Max Streak: ${stats.maxStreak}${avgText}\n\nCan you beat my streak? https://techdle.app`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  if (!mounted || !stats) {
    return (
      <div className="w-full animate-pulse space-y-8">
        <div className="h-8 w-48 bg-surface-raised rounded mx-auto mb-2"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 bg-surface rounded-xl border border-border"></div>
          ))}
        </div>
      </div>
    );
  }

  if (stats.totalPlayed === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-surface-raised rounded-full flex items-center justify-center mb-6 border border-border/50 shadow-lg">
          <Gamepad2 className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-text-main">No Stats Yet</h2>
        <p className="text-text-muted mb-8 text-lg">
          Play your first game to start building your stats and streaks!
        </p>
        <Link 
          href="/"
          className="flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-background font-bold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
        >
          Play Daily Puzzle <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const winPercentage = stats.totalPlayed === 0 ? 0 : Math.round((stats.wins / stats.totalPlayed) * 100);
  const maxGuessCount = Math.max(...Object.values(stats.guessDistribution));
  
  const totalGuessesInWins = Object.entries(stats.guessDistribution)
    .filter(([k]) => k !== 'loss')
    .reduce((sum, [k, v]) => sum + (parseInt(k) * v), 0);
  const averageGuesses = stats.wins === 0 ? 0 : Number((totalGuessesInWins / stats.wins).toFixed(2));

  return (
    <div className="w-full flex flex-col animate-in fade-in duration-500">
      
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 mb-12">
        {/* Left Column: Top level stats */}
        <div className="xl:w-1/2 flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Gamepad2 className="w-6 h-6 text-primary mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main"><CountUp end={stats.totalPlayed} duration={1000} delay={100} /></div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Played</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Trophy className="w-6 h-6 text-success mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main"><CountUp end={winPercentage} duration={1000} delay={200} />%</div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Win Rate</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Flame className="w-6 h-6 text-warning mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main"><CountUp end={stats.currentStreak} duration={1000} delay={300} /></div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Current Streak</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Zap className="w-6 h-6 text-purple-500 mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main"><CountUp end={stats.maxStreak} duration={1000} delay={400} /></div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Max Streak</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Target className="w-6 h-6 text-blue-500 mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main">{stats.wins > 0 ? averageGuesses : '-'}</div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Avg Guesses</div>
            </div>
            <div className="flex flex-col items-center justify-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-sm transition-transform hover:scale-105">
              <Award className="w-6 h-6 text-pink-500 mb-3 opacity-80" />
              <div className="text-3xl font-black text-text-main"><CountUp end={stats.wins} duration={1000} delay={600} /></div>
              <div className="text-[10px] text-text-muted mt-2 uppercase tracking-widest font-bold text-center">Total Wins</div>
            </div>
          </div>
        </div>

        {/* Right Column: Guess Distribution */}
        <div className="xl:w-1/2 flex flex-col justify-center mt-8 xl:mt-0">
          <h3 className="text-xl font-bold mb-6 text-text-main text-center xl:text-left">Guess Distribution</h3>
          <div className="space-y-4">
            {([1, 2, 3, 4, 5, 6] as const).map((guessNum, i) => {
              const count = stats.guessDistribution[guessNum];
              const percent = maxGuessCount === 0 ? 0 : (count / maxGuessCount) * 100;
              const width = Math.max(percent, 7); 
              const isToday = todayState?.status === 'won' && todayState.guesses.length === guessNum;
              const barColor = isToday ? 'bg-success shadow-success/20' : 'bg-primary shadow-primary/20';
              
              return (
                <div key={guessNum} className="flex items-center gap-4 animate-in slide-in-from-left-4 fade-in fill-mode-both" style={{ animationDelay: `${500 + i * 100}ms`, animationDuration: '700ms' }}>
                  <div className="w-10 text-right font-mono text-text-muted font-bold">{guessNum}</div>
                  <div className="flex-1 bg-surface-raised/50 rounded-lg h-10 overflow-hidden relative">
                    <div 
                      className={`${barColor} shadow-lg h-full flex items-center justify-end px-3 text-sm font-bold text-background transition-all duration-[1500ms] ease-out`}
                      style={{ width: `${mounted ? width : 0}%` }}
                    >
                      {count > 0 ? <CountUp end={count} duration={1000} delay={600 + i * 100} /> : ''}
                    </div>
                    {isToday && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-background mix-blend-overlay opacity-90 px-2 py-0.5 rounded">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border/50 animate-in slide-in-from-left-4 fade-in fill-mode-both" style={{ animationDelay: '1200ms', animationDuration: '700ms' }}>
              <div className="w-10 text-right font-mono text-error font-bold text-sm">Loss</div>
              <div className="flex-1 bg-surface-raised/50 rounded-lg h-10 overflow-hidden relative">
                <div 
                  className={`${todayState?.status === 'lost' ? 'bg-error shadow-error/20 text-background' : 'bg-error/40 text-error'} shadow-lg h-full flex items-center justify-end px-3 text-sm font-bold transition-all duration-[1500ms] ease-out`}
                  style={{ width: `${mounted ? Math.max(maxGuessCount === 0 ? 0 : (stats.guessDistribution.loss / maxGuessCount) * 100, 7) : 0}%` }}
                >
                  {stats.guessDistribution.loss > 0 ? <CountUp end={stats.guessDistribution.loss} duration={1000} delay={1300} /> : ''}
                </div>
                {todayState?.status === 'lost' && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-wider text-background mix-blend-overlay opacity-90 px-2 py-0.5 rounded">
                    Today
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap History */}
      <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '1400ms', animationDuration: '700ms' }}>
        <HeatmapGraph archiveResults={archiveResults} todayStr={getTodayDateString()} />
      </div>

      {/* Share Button */}
      <div className="mt-12 flex justify-center animate-in fade-in slide-in-from-bottom-4 fill-mode-both" style={{ animationDelay: '1600ms', animationDuration: '500ms' }}>
        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-8 py-4 bg-surface hover:bg-surface-raised border border-border rounded-xl font-bold transition-all hover:scale-105 active:scale-95 text-text-main shadow-sm"
        >
          <Share2 className="w-5 h-5" />
          {copied ? 'Copied to clipboard!' : 'Share Stats'}
        </button>
      </div>
    </div>
  );
}
