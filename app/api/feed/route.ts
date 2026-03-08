import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser({ timeout: 8000, customFields: { item: ['media:content', 'enclosure'] } });

const FEEDS: Record<string, string[]> = {
  tech: ['https://techcrunch.com/feed/', 'https://www.theverge.com/rss/index.xml'],
  design: ['https://www.smashingmagazine.com/feed/', 'https://uxdesign.cc/feed'],
  finance: ['https://www.hankyung.com/feed/all-news', 'https://feeds.bloomberg.com/markets/news.rss'],
  health: ['https://www.who.int/rss-feeds/news-english.xml', 'https://www.medicalnewstoday.com/rss'],
  science: ['https://www.nature.com/nature.rss', 'https://www.sciencedaily.com/rss/top/science.xml'],
  gaming: ['https://kotaku.com/rss', 'https://www.ign.com/articles.rss'],
  f1: ['https://www.autosport.com/rss/feed/f1', 'https://the-race.com/category/formula-1/feed/', 'https://wtf1.com/feed/'],
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .trim().slice(0, 200);
}

export async function GET(req: NextRequest) {
  const topic = req.nextUrl.searchParams.get('topic') ?? 'tech';
  const urls = FEEDS[topic] ?? FEEDS.tech;
  type FeedEntry = { title: string; link: string; pubDate: string; description: string; source: string };
  const results = await Promise.allSettled(
    urls.map(async (url): Promise<FeedEntry[]> => {
      const feed = await parser.parseURL(url);
      return (feed.items ?? []).slice(0, 8).map((item) => ({
        title: item.title ?? '',
        link: item.link ?? item.guid ?? '#',
        pubDate: item.pubDate ?? item.isoDate ?? '',
        description: stripHtml(item.contentSnippet ?? item.content ?? item.summary ?? ''),
        source: feed.title ?? url,
      }));
    }),
  );
  const items = results
    .filter((r): r is PromiseFulfilledResult<FeedEntry[]> => r.status === 'fulfilled')
    .flatMap((r) => r.value).filter((item) => item.title && item.link)
    .sort((a, b) => (b.pubDate ? new Date(b.pubDate).getTime() : 0) - (a.pubDate ? new Date(a.pubDate).getTime() : 0))
    .slice(0, 20);
  return NextResponse.json(items, { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } });
}
