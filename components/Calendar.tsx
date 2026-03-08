'use client';
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/lib/types';
import { getEvents, addEvent, updateEvent, deleteEvent } from '@/lib/storage';
import EventModal from './EventModal';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];
function toDateStr(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
const COLOR_DOT: Record<string, string> = {
  red: 'bg-red-500', orange: 'bg-orange-500', yellow: 'bg-yellow-400',
  green: 'bg-green-500', blue: 'bg-blue-500', purple: 'bg-purple-500', gray: 'bg-gray-400',
};

export default function Calendar() {
  const [todayStr, setTodayStr] = useState('');
  const [viewDate, setViewDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const refresh = useCallback(() => setEvents(getEvents()), []);

  useEffect(() => {
    const now = new Date();
    setTodayStr(toDateStr(now.getFullYear(), now.getMonth(), now.getDate()));
    setViewDate(now); refresh();
    const handler = () => refresh();
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [refresh]);

  if (!viewDate) return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 flex justify-center"><div className="h-4 w-24 bg-slate-100 rounded animate-pulse" /></div>
      <div className="grid grid-cols-7 gap-0 p-2">{Array.from({ length: 35 }).map((_, i) => (<div key={i} className="h-10 flex items-center justify-center"><div className="w-6 h-6 bg-slate-50 rounded-full animate-pulse" /></div>))}</div>
    </div>
  );

  const year = viewDate.getFullYear(), month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  function handleEventDotClick(e: React.MouseEvent | React.KeyboardEvent, event: CalendarEvent) {
    e.stopPropagation(); setEditingEvent(event); setModalDate(null);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-slate-800 text-sm">{year}년 {month + 1}월</h2>
          <button onClick={() => { const n = new Date(); setViewDate(n); setTodayStr(toDateStr(n.getFullYear(), n.getMonth(), n.getDate())); }} className="text-xs text-blue-600 hover:text-blue-700 px-2 py-0.5 rounded-md hover:bg-blue-50">오늘</button>
        </div>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      <div className="grid grid-cols-7 border-b border-slate-100">
        {WEEKDAYS.map((d, i) => <div key={d} className={`text-center text-xs font-medium py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} className="h-10" />;
          const dateStr = toDateStr(year, month, day);
          const isToday = dateStr === todayStr;
          const isWeekend = idx % 7 === 0 || idx % 7 === 6;
          const dayEvents = events.filter((e) => e.date === dateStr);
          return (
            <button key={dateStr} onClick={() => { setModalDate(dateStr); setEditingEvent(null); }}
              className={`h-10 flex flex-col items-center justify-start pt-1 text-xs transition-colors hover:bg-slate-50 group ${isWeekend && idx % 7 === 0 ? 'text-red-400' : isWeekend ? 'text-blue-400' : 'text-slate-700'}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full font-medium ${isToday ? 'bg-blue-600 text-white' : 'group-hover:bg-slate-100'}`}>{day}</span>
              {dayEvents.length > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span key={ev.id} onClick={(e) => handleEventDotClick(e as unknown as React.MouseEvent, ev)}
                      title={ev.title} role="button" tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleEventDotClick(e as unknown as React.MouseEvent, ev); }}
                      className={`w-1.5 h-1.5 rounded-full ${COLOR_DOT[ev.color ?? ''] ?? 'bg-slate-300'} hover:scale-150 transition-transform cursor-pointer`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-4 py-2 border-t border-slate-100">
        <button onClick={() => { setModalDate(todayStr); setEditingEvent(null); }}
          className="w-full text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-1.5 rounded-lg flex items-center justify-center gap-1 font-medium">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          일정 추가
        </button>
      </div>
      {modalDate && !editingEvent && <EventModal initialDate={modalDate} onSave={(data) => { addEvent(data); refresh(); }} onClose={() => setModalDate(null)} />}
      {editingEvent && <EventModal event={editingEvent} onSave={(data) => { updateEvent({ ...editingEvent, ...data }); refresh(); }} onDelete={() => { deleteEvent(editingEvent.id); refresh(); }} onClose={() => setEditingEvent(null)} />}
    </div>
  );
}
