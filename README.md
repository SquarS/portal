# My Portal — v1.0

나만의 개인 포털. 일정, 뉴스, 검색, 메모, F1 스탠딩을 한 곳에서.

## 스택

- **Next.js 15** (App Router)
- **Tailwind CSS 3.4**
- **TypeScript** (strict)
- **rss-parser** — RSS 피드 수집
- **Supabase** (선택, 미연결 시 localStorage fallback)

## 섹션 구성

| 섹션 | 설명 |
|---|---|
| `section-header` | 인사말 + 구글 검색바 + 시계 |
| `section-calendar` | 월간 캘린더 (7색 태그 CRUD) |
| `section-events` | 다가오는 일정 목록 |
| `section-feed` | 관심사 RSS 피드 (기술/디자인/금융/건강/과학/게임/F1) |
| `section-bookmarks` | 즐겨찾기 |
| `section-memo` | 빠른 메모 (자동 저장) |

## 시작하기

```bash
npm install
npm run dev
# http://localhost:3000
```

## Supabase 연동 (선택)

`.env.local.example` → `.env.local` 복사 후 키 입력.

## F1 데이터

- 스탠딩: [Jolpica API](https://api.jolpi.ca) (무료, 무키)
- 뉴스: Autosport · The Race · WTF1 RSS
