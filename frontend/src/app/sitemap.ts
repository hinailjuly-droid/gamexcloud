import { MetadataRoute } from 'next';
import { gamesApi } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://h5games.space';

  // Since h5games space uses slugs for categories and games, 
  // we would fetch those from the API here in a real scenario.duction app, you might want to paginate this or pull from a separate endpoint
  let gameEntries: MetadataRoute.Sitemap = [];
  try {
    const data = await gamesApi.getGames({ limit: 1000, sort: 'newest' });
    gameEntries = data.games.map((game: any) => ({
      url: `${baseUrl}/game/${game.slug}`,
      lastModified: new Date(game.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Sitemap fetch error:', error);
  }

  const routes = [
    '',
    '/games',
    '/featured',
    '/trending',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/dmca',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.7,
  }));

  const categoryRoutes = [
    'action', 'puzzle', 'rpg', 'racing', 'strategy', 'arcade', 'multiplayer', 'board-card', 'simulation', 'platformer'
  ].map((cat) => ({
    url: `${baseUrl}/category/${cat}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...routes, ...categoryRoutes, ...gameEntries];
}
