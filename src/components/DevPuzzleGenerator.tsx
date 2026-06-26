'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { id: 'Hardware', label: 'Hardware' },
  { id: 'Software', label: 'Software' },
  { id: 'Network', label: 'Network' },
  { id: 'Security', label: 'Security' },
  { id: 'Peripheral', label: 'Peripheral' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Any', label: 'Any (Mixed)' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

interface GeneratedPuzzle {
  date: string;
  id: string;
  category: string;
  difficulty: string;
}

interface GenerateResponse {
  success: boolean;
  puzzles: GeneratedPuzzle[];
  errors: string[];
}

export function DevPuzzleGenerator() {
  const { isDevMode } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(5);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set(CATEGORIES.map((c) => c.id))
  );
  const [difficulty, setDifficulty] = useState('Any');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [progress, setProgress] = useState<string | null>(null);

  if (!isDevMode) return null;

  const toggleCategory = (id: string) => {
    const next = new Set(selectedCategories);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedCategories(next);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setResult(null);
    setProgress('Generating puzzles...');

    try {
      const res = await fetch('/api/generate-puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          count,
          categories: Array.from(selectedCategories),
          difficulty,
        }),
      });

      const data: GenerateResponse = await res.json();
      setResult(data);
      setProgress(null);
    } catch (err) {
      setResult({
        success: false,
        puzzles: [],
        errors: [err instanceof Error ? err.message : 'Network error'],
      });
      setProgress(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const totalSuccess = result?.puzzles.length ?? 0;
  const totalErrors = result?.errors.length ?? 0;

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-full shadow-lg shadow-amber-900/30 transition-all hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-sm">Generate Puzzles</span>
        </button>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-slate-100">Generate Puzzles</h2>
              </div>
              <button
                onClick={() => { setIsOpen(false); setResult(null); setProgress(null); }}
                className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Count */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  How many puzzles?
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                  className="w-24 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500 ml-2">1–20</span>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Categories
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                        selectedCategories.has(cat.id)
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-slate-800 border-slate-600 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
                {selectedCategories.size === 0 && (
                  <p className="text-xs text-red-400 mt-1">Select at least one category</p>
                )}
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || selectedCategories.size === 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold rounded-lg transition-colors"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate {count} Puzzle{count !== 1 ? 's' : ''}
                  </>
                )}
              </button>

              {/* Progress */}
              {progress && (
                <div className="flex items-center gap-2 text-sm text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {progress}
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-3">
                  {/* Success summary */}
                  {totalSuccess > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Created {totalSuccess} puzzle{totalSuccess !== 1 ? 's' : ''}
                      </div>
                      <div className="space-y-1 text-xs">
                        {result.puzzles.map((p) => (
                          <div key={p.date} className="flex items-center gap-2 text-slate-400">
                            <span className="font-mono text-emerald-300/70">{p.date}</span>
                            <span className="text-slate-500">—</span>
                            <span className="text-slate-300">{p.id}</span>
                            <span className="text-slate-600">({p.category}, {p.difficulty})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {totalErrors > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2 text-red-400 font-semibold mb-1">
                        <AlertCircle className="w-4 h-4" />
                        {totalErrors} error{totalErrors !== 1 ? 's' : ''}
                      </div>
                      <ul className="text-xs text-red-300 space-y-0.5 list-disc list-inside">
                        {result.errors.map((err, i) => (
                          <li key={i}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Refresh hint */}
                  {totalSuccess > 0 && (
                    <p className="text-xs text-slate-500 text-center">
                      Refresh the page to play newly generated puzzles.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
