import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchBlogPostBySlug, fetchBlogPosts, fetchGifts } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import { urlFor } from '@/sanity/client'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd'
import type { BlogPost } from '@/lib/types'
import ArticleHero from '@/components/v2/articles/ArticleHero'
import ArticleBody from '@/components/v2/articles/ArticleBody'
import ArticleProse from '@/components/v2/articles/ArticleProse'
import InlineCta from '@/components/v2/articles/InlineCta'
import { ArticleGifts, RelatedArticles } from '@/components/v2/articles/ArticleEnd'
import { AUTHOR, OG_FALLBACK, SITE, formatDate, minutesLabel, prepareArticle, readingMinutesFor } from '@/components/v2/articles/article-content'

interface Props {
  params: Promise<{ slug: string }>
}

// Same routing as the live article page: only published slugs exist
export const dynamicParams = false

export async function generateStaticParams() {
  const posts: BlogPost[] = await fetchBlogPosts().catch(() => [])
  const params = posts.map((p) => ({ slug: p.slug }))
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

const liveUrl = (slug: string) => `${SITE}/articles/${slug}`
const ogImage = (post: BlogPost) => (post.thumbnail ? urlFor(post.thumbnail).width(1200).height(630).url() : null)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!post) return { title: { absolute: 'מאמר לא נמצא — טל רומן' }, robots: { index: false, follow: true } }

  const title = `${post.title} — טל רומן`
  const description = post.excerpt?.trim()
  const url = liveUrl(post.slug)
  const image = ogImage(post)
  const images = image ? [{ url: image, width: 1200, height: 630, alt: post.title }] : [{ url: OG_FALLBACK, width: 1200, height: 630 }]

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    // v2 stays out of the index until it replaces the live pages
    robots: { index: false, follow: true },
    authors: [{ name: AUTHOR, url: SITE }],
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url,
      locale: 'he_IL',
      siteName: AUTHOR,
      publishedTime: post.publishedAt,
      authors: [AUTHOR],
      images,
    },
    twitter: { card: 'summary_large_image', title: post.title, description, images: images.map((i) => i.url) },
  }
}

export default async function ArticleV2Page({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!post) notFound()

  const [article, allPosts, gifts] = await Promise.all([
    prepareArticle(post),
    fetchBlogPosts().catch(() => [] as BlogPost[]),
    fetchGifts().catch(() => []),
  ])

  const url = liveUrl(post.slug)
  const date = formatDate(post.publishedAt)
  const heroImage = getImageUrl(post.thumbnail, 'detail')

  // Related: the newest other articles
  const others = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const relatedMinutes = await Promise.all(
    others.map((p) =>
      fetchBlogPostBySlug(p.slug)
        .then((full) => (full ? readingMinutesFor(full) : null))
        .catch(() => null)
    )
  )
  const related = others.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt?.trim(),
    date: formatDate(p.publishedAt),
    minutes: relatedMinutes[i] ? minutesLabel(relatedMinutes[i]) : null,
  }))

  // The old sidebar showed the first two gifts
  const endGifts = gifts.slice(0, 2).map((g) => ({
    slug: g.slug,
    title: g.title,
    subtitle: g.subtitle,
    imgUrl: g.image ? urlFor(g.image as object).width(840).height(472).url() : null,
  }))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt?.trim(),
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    inLanguage: 'he',
    author: { '@type': 'Person', name: AUTHOR, url: SITE },
    publisher: { '@type': 'Person', name: AUTHOR, url: SITE },
    image: ogImage(post) ?? `${SITE}${OG_FALLBACK}`,
    ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
    ...(article ? { wordCount: article.words, timeRequired: `PT${article.minutes}M` } : {}),
  }

  return (
    <>
      {/* Same overrides as the other v2 pages (no root top padding, no WhatsApp FAB), and the site-wide
          page progress bar steps aside: this page has its own, measured on the article text */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
        .fixed.top-0.bg-gold.origin-left { display: none !important; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: 'טל רומן', url: SITE },
          { name: 'מאמרים', url: `${SITE}/articles` },
          { name: post.title, url },
        ]}
      />
      {article && article.faq.length > 0 && <FaqJsonLd items={article.faq} />}

      <div className="bg-cream">
        <article>
          <ArticleHero
            title={post.title}
            excerpt={post.excerpt?.trim()}
            date={date}
            minutes={article ? minutesLabel(article.minutes) : ''}
            image={heroImage}
          />

          <div className="relative pb-16 md:pb-24">
            {/* Hairline between the masthead and the text */}
            <div aria-hidden className="max-w-[1180px] mx-auto px-6 md:px-10 mb-10 md:mb-14">
              <div className="h-px bg-gradient-to-l from-[#2d1a0e]/20 via-[#2d1a0e]/10 to-transparent" />
            </div>
            {article ? (
              <ArticleBody toc={article.toc} minutes={article.minutes}>
                {article.segments.map((segment, i) => (
                  <div key={i}>
                    {i > 0 && <InlineCta position={i} />}
                    <ArticleProse segment={segment} lede={i === 0} headingIds={article.ptHeadingIds} />
                  </div>
                ))}
                <p aria-hidden className="mt-12 text-center text-brand tracking-[0.6em] select-none">• • •</p>
              </ArticleBody>
            ) : (
              <p className="max-w-[1180px] mx-auto px-6 md:px-10 text-lg text-[#5e5955]">תוכן המאמר בקרוב...</p>
            )}
          </div>

          <ArticleGifts gifts={endGifts} articleSlug={post.slug} />
        </article>

        <RelatedArticles posts={related} />
      </div>
    </>
  )
}
