// My Portal — 메인 포털 페이지
import Clock from '@/components/Clock';
import Greeting from '@/components/Greeting';
import SearchBar from '@/components/SearchBar';
import Calendar from '@/components/Calendar';
import EventList from '@/components/EventList';
import FeedPanel from '@/components/FeedPanel';
import QuickMemo from '@/components/QuickMemo';
import Bookmarks from '@/components/Bookmarks';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100">
      <div className="max-w-[1400px] mx-auto p-4 flex flex-col gap-4">
        <header id="section-header"
          className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 grid grid-cols-3 items-center gap-6">
          <div id="section-greeting"><Greeting /></div>
          <div id="section-search" className="flex justify-center"><SearchBar /></div>
          <div id="section-clock" className="flex justify-end"><Clock /></div>
        </header>
        <div className="grid grid-cols-[300px_1fr_280px] gap-4 items-start">
          <div className="flex flex-col gap-4">
            <div id="section-calendar"><Calendar /></div>
            <div id="section-events"><EventList /></div>
          </div>
          <div id="section-feed" className="min-h-[600px]"><FeedPanel /></div>
          <div className="flex flex-col gap-4">
            <div id="section-bookmarks"><Bookmarks /></div>
            <div id="section-memo"><QuickMemo /></div>
          </div>
        </div>
        <footer className="text-center text-xs text-slate-400 pb-2">My Portal · v1.0.0</footer>
      </div>
    </main>
  );
}
