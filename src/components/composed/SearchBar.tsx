import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { products } from '@/data/products';
import { useTrack } from '@/features/analytics/useTrack';

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  type: string;
  description: string;
}

/** Score how well a query matches a product (higher = better match, 0 = no match) */
function fuzzyScore(query: string, text: string): number {
  const lower = text.toLowerCase();
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);

  // Exact substring match — highest score
  if (lower.includes(query.toLowerCase())) return 100;

  // All words present as substrings
  const allWordsMatch = words.every((w) => lower.includes(w));
  if (allWordsMatch) return 80;

  // Partial word matches (at least half the query words match)
  const matchedWords = words.filter((w) => lower.includes(w));
  if (matchedWords.length > 0) {
    return 40 + (matchedWords.length / words.length) * 30;
  }

  // Character-level fuzzy: check if query chars appear in order
  let qi = 0;
  const q = query.toLowerCase();
  for (let i = 0; i < lower.length && qi < q.length; i++) {
    if (lower[i] === q[qi]) qi++;
  }
  if (qi === q.length) return 20;

  // Prefix match on any word in the text
  const textWords = lower.split(/\s+/);
  for (const w of words) {
    if (textWords.some((tw) => tw.startsWith(w) || w.startsWith(tw))) {
      return 15;
    }
  }

  return 0;
}

function searchProducts(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];

  const scored = products
    .map((p) => {
      const searchable = `${p.title} ${p.description} ${p.tags.join(' ')} ${p.features.join(' ')}`;
      const score = fuzzyScore(query, searchable);
      return { product: p, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return scored.map((s) => ({
    id: s.product.id,
    title: s.product.title,
    slug: s.product.slug,
    type: s.product.type,
    description: s.product.description,
  }));
}

export function SearchBar() {
  const navigate = useNavigate();
  const track = useTrack();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const doSearch = useCallback(
    (q: string) => {
      const found = searchProducts(q);
      setResults(found);
      setIsOpen(found.length > 0);
      setSelectedIndex(-1);
      if (q.length >= 2) {
        track('search_performed', { query: q, resultCount: found.length });
      }
    },
    [track],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(val), 300);
  };

  const handleSelect = (result: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/products/${result.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center border border-gray-300 bg-white dark:bg-slate-800 dark:border-slate-600">
        <svg className="w-4 h-4 text-gray-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search products..."
          role="combobox"
          aria-label="Search products"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
          className="w-full px-2 py-1.5 text-sm text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div id="search-results" className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-lg z-50 max-h-80 overflow-y-auto" role="listbox">
          {results.map((result, i) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-blue-50 dark:hover:bg-slate-700 ${
                i === selectedIndex ? 'bg-blue-50 dark:bg-slate-700' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{result.title}</span>
                <span className="text-[10px] font-bold uppercase text-gray-400 px-1.5 py-0.5 bg-gray-100 dark:bg-slate-700">
                  {result.type}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{result.description}</p>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 shadow-lg z-50 p-4 text-center">
          <p className="text-sm text-gray-500">No products found for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
