'use client';
import { useState, useEffect, useCallback } from 'react';
import { FeedItem, Topic, TopicId } from '@/lib/types';
import { getTopics, saveTopics } from '@/lib/storage';
import F1Panel from './F1Panel';

const ALL_TOPICS: Topic[] = [
  { id: 'tech', label: '기술', enabled: true },
  { id: 'design', label: '디자인', enabled: true },
  { id: 'finance', label: '금융', enabled: true },
  { id: 'health', label: '건강', enabled: false },
  { id: 'science', label: '과학', enabled: false },
  { id: 'gaming', label: '게임', enabled: false },
  { id: 'f1', label: 'F1', enabled: true },
];

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

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <a href={item.link} target="_blank" rel="noopener noreferrer"
      className="block p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all group animate-fade-in">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-xs text-blue-600 font-medium truncate">{item.source}</span>
        <span className="text-xs text-slate-400 shrink-0">{timeAgo(item.pubDate)}</span>
      </div>
      <h3 className="text-sm font-semibold text-slate-800 leading-snug mb-1 group-hover:text-blue-700 transition-colors line-clamp-2">{item.title}</h3>
      {item.description && <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.description}</p>}
    </a>
  );
}

export default function FeedPanel() {
  const [topics, setTopics] = useState<Topic[]>(ALL_TOPICS);
  const [activeTopic, setActiveTopic] = useState<TopicId>('tech');
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTopicEdit, setShowTopicEdit] = useState(false);

  useEffect(() => {
    const saved = getTopics();
    if (saved.length > 0) setTopics(saved);
    const first = (saved.length > 0 ? saved : ALL_TOPICS).find((t) => t.enabled);
    if (first) setActiveTopic(first.id);
  }, []);

  const fetchFeed = useCallback(async (topic: TopicId) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/feed?topic=${topic}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setFeedItems(await res.json());
    } catch { setError('피드를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'); setFeedItems([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchFeed(activeTopic); }, [activeTopic, fetchFeed]);

  function toggleTopic(id: TopicId) {
    const updated = topics.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t));
    setTopics(updated); saveTopics(updated);
    const first = updated.find((t) => t.enabled);
    if (first) setActiveTopic(first.id);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
        <h2 className="text-sm font-semibold text-slate-800">관심사 피드</h2>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchFeed(activeTopic)} disabled={loading}
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50">
            <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button onClick={() => setShowTopicEdit((v) => !v)}
            className={`p-1.5 rounded-lg text-xs ${showTopicEdit ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
      {showTopicEdit && (
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 animate-fade-in">
          <p className="text-xs text-slate-500 mb-2 font-medium">표시할 토픽 선택</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button key={t.id} onClick={() => toggleTopic(t.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${t.enabled ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="flex gap-1 px-4 py-2 border-b border-slate-100 overflow-x-auto shrink-0">
        {topics.filter((t) => t.enabled).map((t) => (
          <button key={t.id} onClick={() => setActiveTopic(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
              t.id === 'f1' && activeTopic === 'f1' ? 'bg-[#E8002D] text-white shadow-sm'
              : t.id === 'f1' ? 'text-[#E8002D] hover:bg-red-50 border border-[#E8002D]/30'
              : activeTopic === t.id ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'
            }`}>
            {t.id === 'f1' ? <span className="italic tracking-tight">F1</span> : t.label}
          </button>
        ))}
      </div>
      {activeTopic === 'f1' ? <div className="flex-1 overflow-hidden"><F1Panel /></div> : (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => (<div key={i} className="animate-pulse border border-slate-100 rounded-xl p-4"><div className="h-3 bg-slate-100 rounded w-24 mb-2" /><div className="h-4 bg-slate-100 rounded w-full mb-1" /><div className="h-4 bg-slate-100 rounded w-3/4" /></div>))}</div>}
          {error && !loading && <div className="text-center py-8"><p className="text-sm text-slate-400">{error}</p><button onClick={() => fetchFeed(activeTopic)} className="mt-3 text-xs text-blue-600 hover:underline">다시 시도</button></div>}
          {!loading && !error && feedItems.length === 0 && <p className="text-sm text-slate-400 text-center py-8">뉴스를 불러오는 중...</p>}
          {!loading && !error && feedItems.map((item, idx) => <FeedCard key={`${item.link}-${idx}`} item={item} />)}
        </div>
      )}
    </div>
  );
}
