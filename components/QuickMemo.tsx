'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { getMemo, saveMemo } from '@/lib/storage';

export default function QuickMemo() {
  const [content, setContent] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => { setContent(getMemo()); }, []);

  const doSave = useCallback((text: string) => {
    saveMemo(text);
    const now = new Date();
    setSavedAt(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 저장됨`);
    setIsDirty(false);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;
    setContent(text); setIsDirty(true); setSavedAt(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSave(text), 800);
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">빠른 메모</h2>
        <div className="flex items-center gap-2">
          {content.length > 0 && <button onClick={() => { setContent(''); doSave(''); }} className="text-xs text-slate-400 hover:text-red-500">지우기</button>}
          {isDirty && <span className="text-xs text-amber-500">•</span>}
          {savedAt && <span className="text-xs text-green-500">{savedAt}</span>}
        </div>
      </div>
      <textarea value={content} onChange={handleChange} placeholder="여기에 메모를 입력하세요." className="flex-1 w-full px-4 py-3 text-sm text-slate-700 placeholder-slate-300 bg-transparent resize-none focus:outline-none leading-relaxed min-h-[140px]" />
      <div className="px-4 py-2 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-300">{content.length}자</span>
        <span className="text-xs text-slate-300">자동 저장</span>
      </div>
    </div>
  );
}
