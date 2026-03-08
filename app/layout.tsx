import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'My Portal',
  description: '나만의 개인 포털 — 일정, 뉴스, 검색, 메모를 한 곳에서',
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏠</text></svg>" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
