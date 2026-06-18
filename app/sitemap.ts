import { MetadataRoute } from 'next';
import { getPublishedProjects } from '@/lib/supabase/queries';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://avaat.design';

  // 1. Core static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },

    {
      url: `${baseUrl}/portfolio`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },

    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    // 2. Dynamic portfolio page paths
    const projects = await getPublishedProjects();
    const projectUrls = projects.map((project) => ({
      url: `${baseUrl}/portfolio/${project.slug}`,
      lastModified: project.updatedAt ? new Date(project.updatedAt) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));



    return [...staticPages, ...projectUrls];
  } catch (error) {
    console.error('Error compiling sitemap routes:', error);
    // Graceful fallback containing only static core pages in case of DB connection issues
    return staticPages;
  }
}