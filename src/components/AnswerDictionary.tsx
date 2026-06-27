'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import { getAllPuzzles } from '@/lib/puzzles';
import { Puzzle } from '@/types/game';

interface DictEntry {
  id: string;
  category: string;
  answer: string;
  explanation: string;
  fixSteps: string[];
}

export function AnswerDictionary() {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<DictEntry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    if (!isOpen) return;
    const puzzles = getAllPuzzles();
    setEntries(
      puzzles.map((p: Puzzle) => ({
        id: p.id,
        category: p.category,
        answer: p.answer,
        explanation: p.explanation,
        fixSteps: p.fixSteps,
      }))
    );
  }, [isOpen]);

  const categories = useMemo(() => {
    const set = new Set(entries.map(e => e.category));
    return Array.from(set).sort();
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter(e => {
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
  }, [entries, search, selectedCategory]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-text-muted hover:text-text-main hover:bg-surface-raised rounded-full transition-all"
        title="Answer Dictionary"
      >
        <BookOpen className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-bold text-text-main">Answer Dictionary</h2>
                <span className="text-xs text-text-muted font-mono">({entries.length})</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); setSearch(''); setSelectedCategory('All'); }}
                className="p-1 text-text-muted hover:text-text-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search + filters */}
            <div className="p-4 border-b border-border shrink-0 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search answers, categories, or keywords..."
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-raised border border-border rounded-lg text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-surface-raised border border-border rounded-lg text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="text-xs text-text-muted self-center ml-auto">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-text-muted">
                  {entries.length === 0 ? 'No puzzles available yet.' : 'No matches found.'}
                </div>
              ) : (
                filtered.map(entry => (
                  <div
                    key={entry.id}
                    className="bg-surface-raised/50 border border-border/50 rounded-xl p-4 hover:border-border/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-semibold text-text-main leading-tight">
                        {entry.answer}
                      </h3>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25">
                          {entry.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed mb-2">
                      {entry.explanation}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-text-muted">
                      <span className="font-mono">#{entry.id}</span>
                      {entry.fixSteps.length > 0 && (
                        <>
                          <span>·</span>
                          <span>{entry.fixSteps.length} fix step{entry.fixSteps.length !== 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
