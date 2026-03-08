'use client';
import { useState, useEffect } from 'react';
import { CalendarEvent } from '@/lib/types';

interface Props {
  initialDate?: string;
  event?: CalendarEvent;
  onSave: (data: Omit<CalendarEvent, 'id' | 'created_at'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const COLOR_OPTIONS: Array<{ value: CalendarEvent['color']; label: string; cls: string }> = [
  { value: 'red', label: '빨강', cls: 'bg-red-500' },
  { value: 'orange', label: '주황', cls: 'bg-orange-500' },
  { value: 'yellow', label: '노랑', cls: 'bg-yellow-400' },
  { value: 'green', label: '초록', cls: 'bg-green-500' },
  { value: 'blue', label: '파랑', cls: 'bg-blue-500' },
  { value: 'purple', label: '보라', cls: 'bg-purple-500' },
  { value: 'gray', label: '회색', cls: 'bg-gray-400' },
];

export default function EventModal({ initialDate, event, onSave, onDelete, onClose }: Props) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [date, setDate] = useState(event?.date ?? initialDate ?? '');
  const [time, setTime] = useState(event?.time ?? '');
  const [memo, setMemo] = useState(event?.memo ?? '');
  const [color, setColor] = useState<CalendarEvent['color']>(event?.color ?? 'blue');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleSubmit() {
    if (!title.trim() || !date) return;
    onSave({ title: title.trim(), date, time: time || undefined, memo: memo || undefined, color });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">{event ? '일정 수정' : '일정 추가'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">제목 *</label>
            <input autoFocus type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }} placeholder="일정 제목"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">날짜 *</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">시간 (선택)</label>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-2">색상 태그</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setColor(opt.value)} title={opt.label}
                  className={`w-7 h-7 rounded-full ${opt.cls} transition-all ${
                    color === opt.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-60 hover:opacity-100'
                  }`} />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">메모 (선택)</label>
            <textarea value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="메모를 입력하세요" rows={3}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-between p-5 border-t border-slate-100">
          <div>{onDelete && <button onClick={() => { onDelete(); onClose(); }} className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium">삭제</button>}</div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium">취소</button>
            <button onClick={handleSubmit} disabled={!title.trim() || !date}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed">
              {event ? '저장' : '추가'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
