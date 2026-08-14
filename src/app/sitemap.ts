import { MetadataRoute } from 'next';
import { db } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.walessgroup.ae';

  const staticPages = [
    '',
    '/about',
    '/services',
    '/gallery',
    '/contact',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const services = await db.service.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    });

    const serviceUrls = services.map((s) => ({
      url: `${baseUrl}/services/${s.slug}`,
      lastModified: s.updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...serviceUrls];
  } catch (error) {
    return staticPages;
  }
}
