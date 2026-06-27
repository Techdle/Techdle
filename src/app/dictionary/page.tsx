'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, Loader2, AlertCircle, ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { Header } from '@/components/Header';
import { StyledSelect } from '@/components/StyledSelect';
import { loadArchiveResults, loadGameState } from '@/lib/storage';

interface DictEntry {
  id: string;
  category: string;
  clues: string[];
  answer: string;
  explanation: string;
  fixSteps: string[];
}

function DictionaryCard({ entry, isUnlocked }: { entry: DictEntry, isUnlocked: boolean }) {
  const [showSymptoms, setShowSymptoms] = useState(false);

  return (
    <div className="relative bg-surface border border-border rounded-xl p-4 sm:p-5 hover:border-border transition-colors shadow-sm w-full overflow-hidden">
      {!isUnlocked && (
        <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[2px] flex items-center justify-center">
          <div className="flex flex-col items-center bg-surface/80 p-4 rounded-xl border border-border/50 shadow-lg">
            <Lock className="w-8 h-8 text-text-muted mb-2" />
            <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Locked</span>
          </div>
        </div>
      )}
      
      <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3 ${!isUnlocked ? 'opacity-50 blur-[2px]' : ''}`}>
        <h3 className="text-xl font-bold text-text-main leading-tight break-words">
          {isUnlocked ? entry.answer : '[CLASSIFIED TICKET]'}
        </h3>
        <div className="flex flex-wrap gap-2 shrink-0">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${isUnlocked ? 'bg-success/10 text-success border-success/20' : 'bg-surface-raised text-text-muted border-border'}`}>
            {isUnlocked ? 'RESOLVED' : 'LOCKED'}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {isUnlocked ? entry.category : '???'}
          </span>
        </div>
      </div>
      
      {isUnlocked && entry.clues && entry.clues.length > 0 && (
        <div className="mb-4 pl-1">
          <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Reported Symptoms</h4>
            <div className="bg-background/30 rounded-lg border border-border/50 overflow-hidden">
              <button 
                onClick={() => setShowSymptoms(!showSymptoms)}
                className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-raised/50 transition-colors text-sm font-medium text-text-muted"
              >
                <span>{showSymptoms ? 'Hide Symptoms' : 'Show Symptoms'}</span>
                {showSymptoms ? <ChevronUp className="w-4 h-4 text-text-muted" /> : <ChevronDown className="w-4 h-4 text-text-muted" />}
              </button>
              
              {showSymptoms && (
                <div className="px-4 py-3 border-t border-border/50 bg-surface/50">
                  <ul className="space-y-1.5">
                    {entry.clues.map((clue, i) => (
                      <li key={i} className="flex gap-2 text-sm text-text-muted">
                        <span className="text-primary mt-0.5 select-none shrink-0">•</span>
                        <span className="break-words min-w-0 flex-1">{clue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
        </div>
      )}
      
      <div className={`bg-background/50 border border-border/50 rounded-lg p-4 mb-4 ${!isUnlocked ? 'opacity-50 blur-[4px]' : ''}`}>
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Root Cause Analysis</h4>
        <p className="text-text-muted leading-relaxed break-words">
          {entry.explanation}
        </p>
      </div>
      
      <div className={`mb-4 pl-1 ${!isUnlocked ? 'opacity-50 blur-[4px]' : ''}`}>
        <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Standard Operating Procedure</h4>
        <ul className="space-y-1.5">
          {(entry.fixSteps || ['Investigate system logs', 'Reboot service', 'Verify resolution']).map((step, i) => (
            <li key={i} className="flex gap-2 text-sm text-text-muted">
              <span className="text-text-muted font-mono mt-0.5 select-none shrink-0">{i + 1}.</span>
              <span className="break-words min-w-0 flex-1">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 text-xs text-text-muted pt-3 border-t border-border/50 mt-auto">
        <span className="font-mono">
          #{entry.id.replace(/-\d+$/, '')}
        </span>
      </div>
    </div>
  );
}

export default function DictionaryPage() {
  const [entries, setEntries] = useState<DictEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'default' | 'completed'>('default');
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsLoading(true);
    try {
      // Load unlocked puzzles
      const results = loadArchiveResults();
      const state = loadGameState();
      const unlocked = new Set(results.map(r => r.puzzleId));
      if (state && state.status !== 'playing') {
        unlocked.add(state.puzzleId);
      }
      setUnlockedIds(unlocked);
      
      // Fetch the full dictionary data from our secure API
      fetch('/api/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ unlockedIds: Array.from(unlocked) })
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch dictionary');
          return res.json();
        })
        .then(data => {
          setEntries(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          setError('Could not load puzzle dictionary');
          setIsLoading(false);
        });
        
    } catch (err) {
      console.error(err);
      setError('Could not load puzzle dictionary');
      setIsLoading(false);
    }
  }, []);

  const categories = useMemo(() => {
    const set = new Set(entries.map(e => e.category));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    let result = entries.filter(e => {
      if (search) {
        const q = search.toLowerCase();
        if (!e.answer.toLowerCase().includes(q) &&
            !e.explanation.toLowerCase().includes(q) &&
            !e.category.toLowerCase().includes(q) &&
            !e.id.toLowerCase().includes(q)) return false;
      }
      if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
      return true;
    });

    if (sortBy === 'completed') {
      result.sort((a, b) => {
        const aUnlocked = unlockedIds.has(a.id);
        const bUnlocked = unlockedIds.has(b.id);
        if (aUnlocked === bUnlocked) return 0;
        return aUnlocked ? -1 : 1;
      });
    }

    return result;
  }, [entries, search, selectedCategory, sortBy, unlockedIds]);

  return (
    <main className="min-h-[100dvh] bg-background text-text-main">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold text-text-main break-words">Answer Dictionary</h1>
            <span className="bg-surface-raised text-text-muted text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1 rounded-full whitespace-nowrap">
              {entries.length} Entries
            </span>
          </div>
          <p className="text-text-muted">
            A complete reference guide to all previously encountered IT tickets and their root causes. Unlocked by playing.
          </p>
        </div>

        {/* Progress Bar */}
        {entries.length > 0 && (
          <div className="bg-surface border border-border rounded-xl p-5 mb-8 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="text-sm font-bold text-text-muted uppercase tracking-widest">Dictionary Completion</span>
              <span className="text-sm font-bold text-text-main">
                {unlockedIds.size} / {entries.length} 
                <span className="text-primary ml-2">({Math.round((unlockedIds.size / entries.length) * 100)}%)</span>
              </span>
            </div>
            <div className="w-full bg-surface-raised rounded-full h-3 overflow-hidden border border-border/50">
              <div 
                className="bg-primary h-full transition-all duration-1000 ease-out"
                style={{ width: `${Math.max((unlockedIds.size / entries.length) * 100, 2)}%` }}
              />
            </div>
          </div>
        )}

        {/* Search + Filters */}
        <div className="bg-surface border border-border rounded-xl p-4 mb-6 space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search answers, categories, or keywords..."
              className="w-full pl-10 pr-4 py-3 bg-surface-raised border border-border rounded-lg text-text-main text-base placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              autoFocus
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <StyledSelect
              className="w-full sm:w-auto min-w-[200px]"
              options={[{ value: 'All', label: 'All Categories' }, ...categories.map(c => ({ value: c, label: c }))]}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <StyledSelect
              className="w-full sm:w-auto min-w-[200px]"
              options={[
                { value: 'default', label: 'Sort: Default' },
                { value: 'completed', label: 'Sort: Resolved First' }
              ]}
              value={sortBy}
              onChange={(val) => setSortBy(val as 'default' | 'completed')}
            />
            <div className="flex items-center justify-center sm:justify-start sm:ml-auto text-sm text-text-muted font-medium bg-surface-raised/50 px-4 py-2 sm:py-0 sm:px-3 rounded-lg border border-border/50">
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-text-muted">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
              <p>Loading the knowledge base...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-error bg-error/20 border border-error/50 rounded-xl">
              <AlertCircle className="w-8 h-8 mb-3" />
              <p>{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-text-muted bg-surface/50 border border-border/50 rounded-xl border-dashed">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-text-muted" />
              <p className="text-lg">{entries.length === 0 ? 'No puzzles available yet.' : 'No matches found.'}</p>
              {entries.length > 0 && <p className="text-sm mt-2">Try adjusting your filters or search term.</p>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 w-full">
              {filtered.map(entry => (
                <DictionaryCard key={entry.id} entry={entry} isUnlocked={unlockedIds.has(entry.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
