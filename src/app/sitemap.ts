import type { MetadataRoute } from 'next'
import { fetchCourses, fetchBlogPosts, fetchGifts } from '@/lib/queries'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.talroman.com'

  const [courses, posts, gifts] = await Promise.all([
    fetchCourses().catch(() => []),
    fetchBlogPosts().catch(() => []),
    fetchGifts().catch(() => []),
  ])

  // Static routes - no lastModified to avoid changing output on every build
  // Google largely ignores lastModified anyway
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/courses`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/articles`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/media`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/communities`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/personal-coaching`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/recommendations`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  // Course routes - no lastModified (we don't have updatedAt from Sanity)
  const courseRoutes: MetadataRoute.Sitemap = courses.map((c: any) => ({
    url: `${baseUrl}/courses/${c.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Article routes - use real publishedAt date when available
  const articleRoutes: MetadataRoute.Sitemap = posts.map((p: any) => ({
    url: `${baseUrl}/articles/${p.slug}`,
    ...(p.publishedAt ? { lastModified: new Date(p.publishedAt) } : {}),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Gift routes - no lastModified
  const giftRoutes: MetadataRoute.Sitemap = gifts.map((g: any) => ({
    url: `${baseUrl}/gifts/${g.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...courseRoutes, ...articleRoutes, ...giftRoutes]
}
