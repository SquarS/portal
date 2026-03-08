import { NextRequest, NextResponse } from 'next/server';
import { F1DriverStanding, F1ConstructorStanding } from '@/lib/types';

const BASE = 'https://api.jolpi.ca/ergast/f1/2026';
const REVALIDATE = 300;
const CACHE_HEADER = 'public, s-maxage=300, stale-while-revalidate=600';

async function fetchJolpica(url: string) {
  const res = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type') ?? 'drivers';
  try {
    if (type === 'constructors') {
      let json = await fetchJolpica(`${BASE}/constructorStandings.json`);
      let list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
      if (list.length === 0) {
        json = await fetchJolpica(`${BASE}/last/constructorStandings.json`);
        list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? [];
      }
      const standings: F1ConstructorStanding[] = list.map((item: Record<string, unknown>) => ({
        position: Number(item.position),
        team: (item.Constructor as Record<string, string>)?.name ?? '',
        nationality: (item.Constructor as Record<string, string>)?.nationality ?? '',
        points: Number(item.points),
        wins: Number(item.wins),
      }));
      return NextResponse.json(standings, { headers: { 'Cache-Control': CACHE_HEADER } });
    } else {
      let json = await fetchJolpica(`${BASE}/driverStandings.json`);
      let list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
      if (list.length === 0) {
        json = await fetchJolpica(`${BASE}/last/driverStandings.json`);
        list = json?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? [];
      }
      const standings: F1DriverStanding[] = list.map((item: Record<string, unknown>) => ({
        position: Number(item.position),
        driver: `${(item.Driver as Record<string, string>)?.givenName ?? ''} ${(item.Driver as Record<string, string>)?.familyName ?? ''}`.trim(),
        code: (item.Driver as Record<string, string>)?.code ?? '',
        nationality: (item.Driver as Record<string, string>)?.nationality ?? '',
        team: (item.Constructors as Record<string, string>[])?.[0]?.name ?? '',
        points: Number(item.points),
        wins: Number(item.wins),
      }));
      return NextResponse.json(standings, { headers: { 'Cache-Control': CACHE_HEADER } });
    }
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
