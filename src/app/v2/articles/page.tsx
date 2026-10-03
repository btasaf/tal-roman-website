import type { Metadata } from 'next'
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import ArticlesIndexV2, { type ArticleCard } from '@/components/v2/articles/ArticlesIndexV2'
import { AUTHOR, OG_FALLBACK, SITE, formatDate, minutesLabel, readingMinutesFor } from '@/components/v2/articles/article-content'

const TITLE = 'מאמרים — טל רומן'
const DESCRIPTION = 'מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.'
const PAGE_URL = `${SITE}/articles`

// v2 stays out of the index until it replaces the live pages
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PAGE_URL },
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    locale: 'he_IL',
    type: 'website',
    images: [{ url: OG_FALLBACK, width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_FALLBACK] },
}

export default async function ArticlesV2Page() {
  const posts = await fetchBlogPosts().catch(() => [])

  // Reading time needs the article body (the list query has no file URL); both are cached
  const minutes = await Promise.all(
    posts.map((p) =>
      fetchBlogPostBySlug(p.slug)
        .then((full) => (full ? readingMinutesFor(full) : null))
        .catch(() => null)
    )
  )

  const cards: ArticleCard[] = posts.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt?.trim(),
    date: formatDate(p.publishedAt),
    minutes: minutes[i] ? minutesLabel(minutes[i]) : null,
    image: getImageUrl(p.thumbnail, 'detail'),
  }))

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    inLanguage: 'he',
    author: { '@type': 'Person', name: AUTHOR, url: SITE },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/articles/${p.slug}`, name: p.title })),
    },
  }

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <BreadcrumbJsonLd
        items={[
          { name: 'טל רומן', url: SITE },
          { name: 'מאמרים', url: PAGE_URL },
        ]}
      />
      <div>
        <ArticlesIndexV2 posts={cards} />
      </div>
    </>
  )
}
