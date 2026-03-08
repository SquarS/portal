'use client';
import { useState, useEffect, useCallback } from 'react';
import { FeedItem, F1DriverStanding, F1ConstructorStanding } from '@/lib/types';

const TEAM_COLORS: Record<string, string> = {
  McLaren: '#FF8000', Ferrari: '#E8002D', Mercedes: '#27F4D2', 'Red Bull': '#3671C6',
  'Aston Martin': '#229971', Alpine: '#0093CC', Williams: '#64C4FF', Haas: '#B6BABD',
  Audi: '#2293D1', Cadillac: '#6692FF',
};

function teamColor(name: string): string {
  for (const [key, val] of Object.entries(TEAM_COLORS)) { if (name.includes(key)) return val; }
  return '#888';
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60_000);
    if (mins < 60) return `${mins}분 전`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}시간 전`;
    return `${Math.floor(hrs / 24)}일 전`;
  } catch { return ''; }
}

function F1NewsCard({ item }: { item: FeedItem }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      className="block p-4 border border-slate-100 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all group animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs text-[#E8002D] font-medium truncate">{item.source}</span>
        <span className="text-xs text-slate-400 shrink-0">{timeAgo(item.pubDate)}</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1 group-hover:text-[#E8002D] transition-colors line-clamp-2">{item.title}</h3>
      {item.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>}
    </a>
  );
}

function DriverRow({ s }: { s: F1DriverStanding }) {
  const color = teamColor(s.team);
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-6 text-center text-xs font-bold text-slate-400">{s.position}</span>
      <span className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 leading-none">{s.driver}</p>
        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{s.team}</p>
      </div>
      <div className="text-right shrink-0"><p className="text-sm font-bold text-slate-800">{s.points}</p><p className="text-[10px] text-slate-400">PTS</p></div>
    </div>
  );
}

function ConstructorRow({ s }: { s: F1ConstructorStanding }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="w-6 text-center text-xs font-bold text-slate-400">{s.position}</span>
      <span className="w-1 h-5 rounded-full shrink-0" style={{ backgroundColor: teamColor(s.team) }} />
      <p className="flex-1 text-sm font-semibold text-slate-800 truncate">{s.team}</p>
      <div className="text-right shrink-0"><p className="text-sm font-bold text-slate-800">{s.points}</p><p className="text-[10px] text-slate-400">PTS</p></div>
    </div>
  );
}

export default function F1Panel() {
  const [standingTab, setStandingTab] = useState<'drivers' | 'constructors'>('drivers');
  const [driverStandings, setDriverStandings] = useState<F1DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<F1ConstructorStanding[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(true);
  const [newsItems, setNewsItems] = useState<FeedItem[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [showAllStandings, setShowAllStandings] = useState(false);

  const fetchStandings = useCallback(async () => {
    setStandingsLoading(true);
    try {
      const [drRes, ctRes] = await Promise.all([
        fetch('/api/f1standings?type=drivers', { cache: 'no-store' }),
        fetch('/api/f1standings?type=constructors', { cache: 'no-store' }),
      ]);
      const [dr, ct] = await Promise.all([drRes.json(), ctRes.json()]);
      setDriverStandings(dr); setConstructorStandings(ct);
    } catch { } finally { setStandingsLoading(false); }
  }, []);

  const fetchNews = useCallback(async () => {
    setNewsLoading(true); setNewsError(null);
    try {
      const res = await fetch('/api/feed?topic=f1', { cache: 'no-store' });
      if (!res.ok) throw new Error();
      setNewsItems(await res.json());
    } catch { setNewsError('뉴스를 불러오지 못했습니다.'); } finally { setNewsLoading(false); }
  }, []);

  useEffect(() => { fetchStandings(); fetchNews(); }, [fetchStandings, fetchNews]);

  const shownDrivers = showAllStandings ? driverStandings : driverStandings.slice(0, 5);
  const shownConstructors = showAllStandings ? constructorStandings : constructorStandings.slice(0, 5);
  const hasStandings = standingTab === 'drivers' ? driverStandings.length > 0 : constructorStandings.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
      <div className="relative bg-[#E8002D] px-5 py-4 flex items-center justify-between shrink-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 8px, #000 8px, #000 10px)' }} />
        <div className="relative flex items-center gap-3">
          <div className="bg-white rounded px-2 py-0.5"><span className="text-[#E8002D] font-black text-lg tracking-tighter leading-none italic">F1</span></div>
          <div><p className="text-white font-black text-sm uppercase tracking-widest leading-none">Formula 1</p><p className="text-white/60 text-[10px] uppercase tracking-wider mt-0.5">2026 Season</p></div>
        </div>
        <button onClick={() => { fetchStandings(); fetchNews(); }} className="relative text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex gap-1 mb-3">
          {(['drivers', 'constructors'] as const).map((tab) => (
            <button key={tab} onClick={() => setStandingTab(tab)}
              className={`flex-1 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-lg transition-colors ${
                standingTab === tab ? 'bg-[#E8002D] text-white' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}>{tab === 'drivers' ? 'Drivers' : 'Teams'}</button>
          ))}
        </div>
        {standingsLoading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}</div>
        ) : !hasStandings ? (
          <div className="text-center py-5">
            <p className="text-2xl mb-1">🏁</p>
            <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Season in progress</p>
            <p className="text-[10px] text-slate-300 mt-1">첫 레이스 결과 대기 중</p>
          </div>
        ) : (
          <>
            {standingTab === 'drivers' ? shownDrivers.map((s) => <DriverRow key={s.position} s={s} />) : shownConstructors.map((s) => <ConstructorRow key={s.position} s={s} />)}
            {(standingTab === 'drivers' ? driverStandings : constructorStandings).length > 5 && (
              <button onClick={() => setShowAllStandings((v) => !v)} className="w-full mt-2 text-[10px] uppercase tracking-widest font-bold text-slate-400 hover:text-slate-600 py-1.5">
                {showAllStandings ? '접기' : '전체 보기'}
              </button>
            )}
          </>
        )}
      </div>
      <div className="mx-4 mb-3 border-t border-slate-100" />
      <div className="px-4 pb-2 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-800">Latest News</p>
          <a href="https://www.formula1.com/en/latest" target="_blank" rel="noopener noreferrer" className="text-[10px] text-[#E8002D] hover:text-red-700 font-medium">f1.com →</a>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {newsLoading && <div className="space-y-3">{[...Array(5)].map((_, i) => (<div key={i} className="animate-pulse border border-slate-100 rounded-xl p-4"><div className="h-3 bg-slate-100 rounded w-24 mb-2" /><div className="h-4 bg-slate-100 rounded w-full mb-1" /><div className="h-4 bg-slate-100 rounded w-3/4" /></div>))}</div>}
        {newsError && !newsLoading && <div className="text-center py-8"><p className="text-sm text-slate-400">{newsError}</p><button onClick={fetchNews} className="mt-3 text-xs text-[#E8002D] hover:underline">다시 시도</button></div>}
        {!newsLoading && !newsError && newsItems.map((item, idx) => <F1NewsCard key={`${item.link}-${idx}`} item={item} />)}
        {!newsLoading && !newsError && newsItems.length === 0 && <p className="text-sm text-slate-400 text-center py-8">뉴스를 불러오는 중...</p>}
      </div>
    </div>
  );
}
