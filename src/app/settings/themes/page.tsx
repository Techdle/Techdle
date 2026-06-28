"use client";

import { Header } from '@/components/Header';
import { useTheme } from '@/components/ThemeProvider';
import { themes } from '@/lib/themes';
import { ArrowLeft, Store, Filter, Heart, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function ThemeStorePage() {
  const { theme, setTheme, favorites, toggleFavorite } = useTheme();
  const [filter, setFilter] = useState<'all' | 'favorites'>('all');

  const displayedThemes = filter === 'favorites' ? themes.filter(t => favorites.includes(t.id)) : themes;

  return (
    <div className="min-h-[100dvh] bg-background text-text-main font-sans pb-12">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12 animate-in fade-in">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/settings"
              className="p-2 hover:bg-surface-raised rounded-full transition-colors text-text-muted hover:text-text-main"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-serif text-primary flex items-center gap-3">
                <Store className="w-6 h-6" />
                Theme Store
              </h1>
              <p className="text-text-muted text-sm mt-1">DISCOVER YOUR LOOK</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-surface p-1 rounded-xl border border-border">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${filter === 'all' ? 'bg-surface-raised text-text-main' : 'text-text-muted hover:text-text-main'}`}
            >
              <Filter className="w-4 h-4" /> All
            </button>
            <button 
              onClick={() => setFilter('favorites')}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${filter === 'favorites' ? 'bg-surface-raised text-text-main' : 'text-text-muted hover:text-text-main'}`}
            >
              <Heart className={`w-4 h-4 ${filter === 'favorites' ? 'fill-current' : ''}`} /> Favorites
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedThemes.map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            const isFavorite = favorites.includes(t.id);
            
            return (
              <div 
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex flex-col bg-surface rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  isActive ? 'border-primary shadow-lg scale-[1.02]' : 'border-border hover:border-text-muted hover:-translate-y-1'
                }`}
              >
                {/* Preview Window */}
                <div 
                  className="h-40 w-full relative p-4 flex flex-col justify-between"
                  style={{ background: t.colors.surface }}
                >
                  <div className="absolute inset-0 opacity-40" style={{ background: `linear-gradient(135deg, ${t.colors.primary}, transparent)` }} />
                  <div className="relative z-10 flex justify-end">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(t.id); }}
                      className="w-8 h-8 rounded-full bg-background/20 hover:bg-background/40 backdrop-blur-sm flex items-center justify-center transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white text-white' : 'text-white'}`} />
                    </button>
                  </div>
                  <div className="relative z-10 flex-1 flex items-center justify-center">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md"
                      style={{ background: `${t.colors.background}80`, border: `1px solid ${t.colors.primary}40` }}
                    >
                      <Icon className="w-8 h-8" style={{ color: t.colors.primary }} />
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col gap-4">
                  <div>
                    <h3 className="text-xl font-bold font-serif text-text-main">{t.name}</h3>
                    <p className="text-sm text-text-muted">{t.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-surface-raised rounded-md text-text-muted">
                      {t.mode}
                    </span>
                    
                    {isActive && (
                      <div className="flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                        <CheckCircle2 className="w-4 h-4" />
                        ACTIVE
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayedThemes.length === 0 && (
          <div className="text-center py-20">
            <Heart className="w-12 h-12 text-border mx-auto mb-4" />
            <h2 className="text-xl font-bold text-text-muted mb-2">No favorites yet</h2>
            <p className="text-text-muted">Click the heart icon on any theme to add it to your favorites.</p>
          </div>
        )}

      </main>
    </div>
  );
}
