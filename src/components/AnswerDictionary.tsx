'use client';

import { useState, useEffect, useMemo } from 'react';
import { BookOpen, X, Search } from 'lucide-react';
import { getAllPuzzles } from '@/lib/puzzles';
import { Puzzle } from '@/types/game';

interface DictEntry {
  date: string;
  id: string;
  category: string;
  difficulty: string;
  answer: string;
  explanation: string;
  fixSteps: string[];
}

export function AnswerDictionary() {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<DictEntry[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  useEffect(() => {
    if (!isOpen) return;
    const puzzles = getAllPuzzles();
    setEntries(
      puzzles.map((p: Puzzle) => ({
        date: p.date || '',
        id: p.id,
        category: p.category,
        difficulty: p.difficulty,
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
      if (selectedDifficulty !== 'All' && e.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [entries, search, selectedCategory, selectedDifficulty]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-full transition-all"
        title="Answer Dictionary"
      >
        <BookOpen className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-700 shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-slate-100">Answer Dictionary</h2>
                <span className="text-xs text-slate-500 font-mono">({entries.length})</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); setSearch(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search + filters */}
            <div className="p-4 border-b border-slate-800 shrink-0 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search answers, categories, or keywords..."
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Categories</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select
                  value={selectedDifficulty}
                  onChange={e => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-800 border border-slate-600 rounded-lg text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <span className="text-xs text-slate-500 self-center ml-auto">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  {entries.length === 0 ? 'No puzzles available yet.' : 'No matches found.'}
                </div>
              ) : (
                filtered.map(entry => (
                  <div
                    key={entry.date || entry.id}
                    className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-semibold text-slate-100 leading-tight">
                        {entry.answer}
                      </h3>
                      <div className="flex gap-1.5 shrink-0">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25">
                          {entry.category}
                        </span>
                        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                          entry.difficulty === 'Easy' ? 'bg-green-500/15 text-green-400 border-green-500/25' :
                          entry.difficulty === 'Hard' ? 'bg-red-500/15 text-red-400 border-red-500/25' :
                          'bg-amber-500/15 text-amber-400 border-amber-500/25'
                        }`}>
                          {entry.difficulty}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed mb-2">
                      {entry.explanation}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="font-mono">#{entry.id}</span>
                      <span>·</span>
                      <span>{entry.date}</span>
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
