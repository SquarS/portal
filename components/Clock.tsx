'use client';
import { useState, useEffect } from 'react';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  if (!now) return <div className="h-8 w-40 animate-pulse bg-slate-100 rounded" />;
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const dateStr = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 (${DAYS[now.getDay()]})`;
  return (
    <div className="flex items-center gap-3 select-none">
      <span className="text-2xl font-semibold tracking-tight text-slate-800 font-mono tabular-nums">
        {hh}<span className="text-slate-300 mx-0.5">:</span>{mm}
      </span>
      <div className="w-px h-6 bg-slate-200" />
      <span className="text-xs text-slate-400 leading-tight">{dateStr}</span>
    </div>
  );
}
