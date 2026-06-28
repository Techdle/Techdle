import { useState, useRef, useEffect, useMemo } from 'react';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  onType?: () => void;
  disabled: boolean;
  shakeKey?: number;
  /** Answer + aliases for the current puzzle, used for autocomplete suggestions */
  targets?: string[];
}

export function GuessInput({ onSubmit, onType, disabled, shakeKey, targets = [] }: GuessInputProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [shake, setShake] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Normalize all targets for matching
  const allTargets = useMemo(() => {
    const set = new Set<string>();
    targets.forEach(t => {
      set.add(t);
      // Also add the normalized version as a suggestion option
      const lowered = t.toLowerCase();
      if (lowered !== t) set.add(lowered);
    });
    return Array.from(set);
  }, [targets]);

  useEffect(() => {
    if (input.trim().length > 0) {
      const match = input.toLowerCase();
      const filtered = allTargets.filter(a => a.toLowerCase().includes(match));
      // Sort matches that start with the query higher
      filtered.sort((a, b) => {
        const aStarts = a.toLowerCase().startsWith(match) ? -1 : 1;
        const bStarts = b.toLowerCase().startsWith(match) ? -1 : 1;
        return aStarts - bStarts;
      });
      setSuggestions(filtered.slice(0, 20)); // eslint-disable-line react-hooks/set-state-in-effect
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [input, allTargets]);

  // Trigger shake animation when shakeKey changes (parent signals a wrong guess)
  useEffect(() => {
    if (shakeKey && shakeKey > 0) {
      setShake(true); // eslint-disable-line react-hooks/set-state-in-effect
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shakeKey]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || disabled) return;

    onSubmit(input.trim());
    setInput('');
    setShowSuggestions(false);
  };

  const selectSuggestion = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    }
  };

  const renderSuggestion = (suggestion: string, query: string) => {
    const index = suggestion.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return suggestion;
    return (
      <>
        {suggestion.substring(0, index)}
        <strong className="text-primary font-bold">{suggestion.substring(index, index + query.length)}</strong>
        {suggestion.substring(index + query.length)}
      </>
    );
  };

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            onType?.();
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? 'Game Over' : 'Identify the root cause...'}
          className={`w-full bg-surface border rounded-lg px-4 py-3 text-lg text-text-main placeholder:text-text-muted focus:outline-none focus:ring-2 disabled:opacity-50 transition-colors ${
            shake
              ? 'border-error focus:ring-error animate-shake'
              : 'border-border focus:ring-primary'
          }`}
          autoComplete="new-password"
          spellCheck="false"
          aria-label="Guess input"
          aria-autocomplete="list"
          aria-controls="suggestions-list"
          aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
          aria-describedby="game-status"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="absolute right-2 top-2 bottom-2 px-4 bg-primary-hover hover:bg-primary-hover text-text-main font-medium rounded disabled:opacity-50 disabled:hover:bg-primary-hover transition-colors"
        >
          Submit
        </button>
      </form>

      {showSuggestions && suggestions.length > 0 && !disabled && (
        <ul id="suggestions-list" role="listbox" className="absolute z-50 w-full mt-1 bg-surface-raised border border-border rounded-lg shadow-xl overflow-y-auto max-h-64 custom-scrollbar">
          {suggestions.map((s, i) => (
            <li
              key={i}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === selectedIndex}
              onClick={() => selectSuggestion(s)}
              className={`px-4 py-4 cursor-pointer text-text-main border-b border-border/50 last:border-0 transition-colors ${i === selectedIndex ? 'bg-surface-raised' : 'hover:bg-surface-raised'}`}
            >
              {renderSuggestion(s, input.trim())}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
