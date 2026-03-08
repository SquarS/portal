'use client';
import { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from '@/lib/types';
import { getEvents, updateEvent, deleteEvent } from '@/lib/storage';
import EventModal from './EventModal';

const COLOR_BG: Record<string, string> = {
  red: 'bg-red-500', orange: 'bg-orange-500', yellow: 'bg-yellow-400',
  green: 'bg-green-500', blue: 'bg-blue-500', purple: 'bg-purple-500', gray: 'bg-gray-400',
};

function formatDate(dateStr: string, today: string, tomorrow: string): string {
  if (dateStr === today) return '오늘';
  if (dateStr === tomorrow) return '내일';
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function EventList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [today, setToday] = useState('');
  const [tomorrow, setTomorrow] = useState('');

  const refresh = useCallback(() => {
    const t = new Date().toISOString().slice(0, 10);
    setEvents(getEvents().filter((e) => e.date >= t).sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      return d !== 0 ? d : (a.time ?? '').localeCompare(b.time ?? '');
    }));
  }, []);

  useEffect(() => {
    const now = new Date();
    setToday(now.toISOString().slice(0, 10));
    setTomorrow(new Date(now.getTime() + 86_400_000).toISOString().slice(0, 10));
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [refresh]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800">다가오는 일정</h2>
        {events.length > 0 && <span className="text-xs text-slate-400">{events.length}개</span>}
      </div>
      <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
        {events.length === 0 ? <p className="text-sm text-slate-400 text-center py-6">예정된 일정이 없어요</p> : (
          events.slice(0, 10).map((event) => (
            <button key={event.id} onClick={() => setEditingEvent(event)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left group">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${COLOR_BG[event.color ?? ''] ?? 'bg-slate-300'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${event.date === today ? 'text-blue-700' : event.date === tomorrow ? 'text-slate-800' : 'text-slate-700'}`}>{event.title}</p>
                <p className="text-xs text-slate-400">
                  <span className={event.date === today ? 'text-blue-500 font-medium' : ''}>{formatDate(event.date, today, tomorrow)}</span>
                  {event.time && ` · ${event.time}`}
                </p>
              </div>
              <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))
        )}
      </div>
      {editingEvent && <EventModal event={editingEvent}
        onSave={(data) => { updateEvent({ ...editingEvent, ...data }); refresh(); }}
        onDelete={() => { deleteEvent(editingEvent.id); refresh(); }}
        onClose={() => setEditingEvent(null)} />}
    </div>
  );
}
