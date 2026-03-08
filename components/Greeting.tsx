'use client';
import { useEffect, useState } from 'react';
import { getEvents } from '@/lib/storage';

function getGreeting(hour: number): string {
  if (hour < 6) return '좋은 새벽이에요';
  if (hour < 12) return '좋은 아침이에요';
  if (hour < 18) return '좋은 오후예요';
  return '좋은 저녁이에요';
}

export default function Greeting() {
  const [greeting, setGreeting] = useState('');
  const [todayCount, setTodayCount] = useState(0);
  useEffect(() => {
    const now = new Date();
    setGreeting(getGreeting(now.getHours()));
    const today = now.toISOString().slice(0, 10);
    setTodayCount(getEvents().filter((e) => e.date === today).length);
  }, []);
  return (
    <div>
      <p className="text-lg font-semibold text-slate-800">{greeting} 👋</p>
      <p className="text-sm text-slate-500 mt-0.5">
        {todayCount > 0 ? `오늘 일정이 ${todayCount}개 있어요` : '오늘 일정이 없어요'}
      </p>
    </div>
  );
}
