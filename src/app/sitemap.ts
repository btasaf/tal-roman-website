import type { MetadataRoute } from 'next'
import { fetchCourses, fetchBlogPosts, fetchGifts } from '@/lib/queries'

export const dynamic = 'force-static'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.talroman.com'

  const [courses, posts, gifts] = await Promise.all([
    fetchCourses().catch(() => []),
    fetchBlogPosts().catch(() => []),
    fetchGifts().catch(() => []),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/courses`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/media`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/communities`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/personal-coaching`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/recommendations`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const courseRoutes: MetadataRoute.Sitemap = courses.map((c: any) => ({
    url: `${baseUrl}/courses/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const articleRoutes: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${baseUrl}/articles/${p.slug}`,
    lastModified: p.publishedAt ? new Date(p.publishedAt) : new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const giftRoutes: MetadataRoute.Sitemap = gifts.map((g: any) => ({
    url: `${baseUrl}/gifts/${g.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...courseRoutes, ...articleRoutes, ...giftRoutes]
}
