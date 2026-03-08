export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  memo?: string;
  color?: 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'gray';
  created_at: string;
}

export interface QuickMemo { content: string; updated_at: string; }

export interface Bookmark { id: string; title: string; url: string; }

export interface FeedItem { title: string; link: string; pubDate: string; description?: string; source: string; }

export type TopicId = 'tech' | 'design' | 'finance' | 'health' | 'science' | 'gaming' | 'f1';

export interface F1DriverStanding {
  position: number; driver: string; code: string; nationality: string; team: string; points: number; wins: number;
}

export interface F1ConstructorStanding {
  position: number; team: string; nationality: string; points: number; wins: number;
}

export interface Topic { id: TopicId; label: string; enabled: boolean; }
