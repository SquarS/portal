'use client';
import { useState, useEffect } from 'react';
import { Bookmark } from '@/lib/types';
import { getBookmarks, addBookmark, deleteBookmark } from '@/lib/storage';

function getFavicon(url: string): string {
  try { const { hostname } = new URL(url); return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`; } catch { return ''; }
}

export default function Bookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);

  useEffect(() => { setBookmarks(getBookmarks()); }, []);

  function handleAdd() {
    if (!newTitle.trim() || !newUrl.trim()) return;
    let url = newUrl.trim();
    if (!url.startsWith('http')) url = `https://${url}`;
    setBookmarks((prev) => [...prev, addBookmark({ title: newTitle.trim(), url })]);
    setNewTitle(''); setNewUrl(''); setShowForm(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">즐겨찾기</h2>
        <div className="flex gap-1">
          <button onClick={() => setDeleteMode((v) => !v)} className={`p-1.5 rounded-lg text-xs ${deleteMode ? 'bg-red-50 text-red-500' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </button>
          <button onClick={() => { setShowForm((v) => !v); setDeleteMode(false); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </button>
        </div>
      </div>
      {showForm && (
        <div className="p-3 border-b border-slate-100 bg-slate-50 space-y-2 animate-fade-in">
          <input autoFocus type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="이름" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
          <input type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }} placeholder="URL (예: google.com)" className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-400" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowForm(false)} className="text-xs text-slate-500 px-2 py-1 hover:bg-slate-200 rounded">취소</button>
            <button onClick={handleAdd} className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700">추가</button>
          </div>
        </div>
      )}
      <div className="p-2 grid grid-cols-2 gap-1">
        {bookmarks.map((bm) => (
          <div key={bm.id} className="relative group">
            <a href={bm.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50">
              <img src={getFavicon(bm.url)} alt="" className="w-4 h-4 rounded shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-xs text-slate-700 truncate font-medium">{bm.title}</span>
            </a>
            {deleteMode && <button onClick={() => { deleteBookmark(bm.id); setBookmarks((p) => p.filter((b) => b.id !== bm.id)); }} className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600">×</button>}
          </div>
        ))}
      </div>
    </div>
  );
}
