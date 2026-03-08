'use client';
import { useState, useRef, KeyboardEvent } from 'react';
import { searchInternal } from '@/lib/storage';
import { CalendarEvent } from '@/lib/types';

const COLORS: Record<string, string> = {
  red: 'bg-red-500', orange: 'bg-orange-500', yellow: 'bg-yellow-400',
  green: 'bg-green-500', blue: 'bg-blue-500', purple: 'bg-purple-500', gray: 'bg-gray-400',
};

export default function SearchBar({ onEventClick }: { onEventClick?: (event: CalendarEvent) => void }) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'web' | 'internal'>('web');
  const [results, setResults] = useState<CalendarEvent[]>([]);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch() {
    if (!query.trim()) return;
    if (mode === 'web') window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
    else { setResults(searchInternal(query)); setShowResults(true); }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') { setShowResults(false); setQuery(''); }
  }

  function handleModeToggle() {
    setMode((p) => (p === 'web' ? 'internal' : 'web'));
    setShowResults(false); setResults([]); setQuery('');
    inputRef.current?.focus();
  }

  return (
    <div className="relative w-full max-w-sm">
      <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <button onClick={handleModeToggle} className="px-3 py-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 shrink-0">
          {mode === 'web' ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 012-2v-1a2 2 0 012-2h1.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h0a2.5 2.5 0 002.5-2.5V3.935M12 21a9 9 0 110-18 9 9 0 010 18z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </button>
        <input ref={inputRef} type="text" value={query}
          onChange={(e) => { setQuery(e.target.value); if (mode === 'internal' && e.target.value) { setResults(searchInternal(e.target.value)); setShowResults(true); } else setShowResults(false); }}
          onKeyDown={handleKeyDown}
          placeholder={mode === 'web' ? 'Google 검색...' : '일정 · 메모 검색...'}
          className="flex-1 py-2.5 pr-2 text-sm text-slate-700 bg-transparent outline-none placeholder-slate-400" />
        <button onClick={handleSearch} className="px-3 py-2.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
        </button>
      </div>
      <div className="mt-1 text-xs text-center text-slate-400">
        {mode === 'web' ? '웹 검색 (Enter로 Google 열기)' : '내부 검색 (일정 · 메모)'}
      </div>
      {showResults && mode === 'internal' && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto animate-fade-in">
          {results.length === 0 ? <p className="p-4 text-sm text-slate-400 text-center">검색 결과 없음</p> : (
            <ul>{results.map((event) => (
              <li key={event.id}>
                <button onClick={() => { onEventClick?.(event); setShowResults(false); setQuery(''); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${COLORS[event.color ?? ''] ?? 'bg-slate-300'}`} />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{event.title}</p>
                    <p className="text-xs text-slate-400">{event.date}{event.time ? ` · ${event.time}` : ''}{event.memo ? ` · ${event.memo.slice(0, 40)}` : ''}</p>
                  </div>
                </button>
              </li>
            ))}</ul>
          )}
        </div>
      )}
    </div>
  );
}
