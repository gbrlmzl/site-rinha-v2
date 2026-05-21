import { MetadataRoute } from 'next';

interface TournamentPublicSummaryData {
  slug: string;
  startsAt: string;
}

interface Page<T> {
  content: T[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://rinhacampusiv.org';
  const apiUrl = process.env.INTERNAL_API_URL ?? 'http://localhost:8080';

  try {
    const res = await fetch(`${apiUrl}/tournaments?size=1000`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data: Page<TournamentPublicSummaryData> = await res.json();

    return data.content.map((tournament) => ({
      url: `${siteUrl}/lol/torneios/${tournament.slug}`,
      lastModified: new Date(tournament.startsAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // API unavailable at build time — return empty list
    return [];
  }
}
