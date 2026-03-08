import { CalendarEvent, Bookmark, Topic, TopicId } from './types';

const KEYS = { events: 'portal_events', memo: 'portal_memo', bookmarks: 'portal_bookmarks', topics: 'portal_topics' } as const;

export function getEvents(): CalendarEvent[] {
  if (typeof window === 'undefined') return [];
  try { const raw = localStorage.getItem(KEYS.events); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

export function saveEvents(events: CalendarEvent[]): void {
  localStorage.setItem(KEYS.events, JSON.stringify(events));
  if (typeof window !== 'undefined') window.dispatchEvent(new StorageEvent('storage', { key: KEYS.events }));
}

export function addEvent(event: Omit<CalendarEvent, 'id' | 'created_at'>): CalendarEvent {
  const newEvent: CalendarEvent = { ...event, id: crypto.randomUUID(), created_at: new Date().toISOString() };
  saveEvents([...getEvents(), newEvent]);
  return newEvent;
}

export function updateEvent(updated: CalendarEvent): void {
  saveEvents(getEvents().map((e) => (e.id === updated.id ? updated : e)));
}

export function deleteEvent(id: string): void { saveEvents(getEvents().filter((e) => e.id !== id)); }

export function getMemo(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(KEYS.memo) ?? '';
}

export function saveMemo(content: string): void { localStorage.setItem(KEYS.memo, content); }

const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'Google', url: 'https://www.google.com' },
  { id: '2', title: 'Gmail', url: 'https://mail.google.com' },
  { id: '3', title: 'GitHub', url: 'https://github.com' },
  { id: '4', title: 'YouTube', url: 'https://www.youtube.com' },
  { id: '5', title: 'ChatGPT', url: 'https://chat.openai.com' },
  { id: '6', title: 'Notion', url: 'https://www.notion.so' },
];

export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return DEFAULT_BOOKMARKS;
  try { const raw = localStorage.getItem(KEYS.bookmarks); return raw ? JSON.parse(raw) : DEFAULT_BOOKMARKS; } catch { return DEFAULT_BOOKMARKS; }
}

export function saveBookmarks(bookmarks: Bookmark[]): void { localStorage.setItem(KEYS.bookmarks, JSON.stringify(bookmarks)); }

export function addBookmark(bookmark: Omit<Bookmark, 'id'>): Bookmark {
  const newBm: Bookmark = { ...bookmark, id: crypto.randomUUID() };
  saveBookmarks([...getBookmarks(), newBm]);
  return newBm;
}

export function deleteBookmark(id: string): void { saveBookmarks(getBookmarks().filter((b) => b.id !== id)); }

const DEFAULT_TOPICS: Topic[] = [
  { id: 'tech', label: '기술', enabled: true },
  { id: 'design', label: '디자인', enabled: true },
  { id: 'finance', label: '금융', enabled: true },
  { id: 'health', label: '건강', enabled: false },
  { id: 'science', label: '과학', enabled: false },
  { id: 'gaming', label: '게임', enabled: false },
  { id: 'f1', label: 'F1', enabled: true },
];

export function getTopics(): Topic[] {
  if (typeof window === 'undefined') return DEFAULT_TOPICS;
  try { const raw = localStorage.getItem(KEYS.topics); return raw ? JSON.parse(raw) : DEFAULT_TOPICS; } catch { return DEFAULT_TOPICS; }
}

export function saveTopics(topics: Topic[]): void { localStorage.setItem(KEYS.topics, JSON.stringify(topics)); }

export function searchInternal(query: string): CalendarEvent[] {
  const q = query.toLowerCase();
  return getEvents().filter((e) => e.title.toLowerCase().includes(q) || (e.memo ?? '').toLowerCase().includes(q));
}

export type { TopicId };
