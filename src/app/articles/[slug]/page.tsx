import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import mammoth from 'mammoth'
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import ArticleGiftSidebar from '@/components/ArticleGiftSidebar'
import ArticleViewTracker from '@/components/ArticleViewTracker'
import type { BlogPost } from '@/lib/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts: BlogPost[] = await fetchBlogPosts().catch(() => [])
  const params = posts.map((p) => ({ slug: p.slug }))
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!post) return { title: 'מאמר לא נמצא' }

  const imageUrl = getImageUrl(post.thumbnail, 'detail')

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['טל רומן'],
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

async function parseDocx(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const arrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const { value } = await mammoth.convertToHtml({ buffer })
    return value || null
  } catch (err) {
    console.error('[parseDocx] failed:', err)
    return null
  }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!post) notFound()

  const imageUrl = getImageUrl(post.thumbnail, 'detail')
  console.log('[article] docxFileUrl:', post.docxFileUrl)
  const docxHtml = post.docxFileUrl ? await parseDocx(post.docxFileUrl) : null
  console.log('[article] docxHtml length:', docxHtml?.length ?? 'null')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: { '@type': 'Person', name: 'טל רומן' },
    datePublished: post.publishedAt,
    ...(imageUrl ? { image: imageUrl } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArticleViewTracker slug={slug} title={post.title} />
      <div className="min-h-screen bg-cream" dir="rtl">
        {/* Hero */}
        <div className="bg-gradient-to-b from-night/95 to-night/80 pt-24 pb-12 px-4">
          <div className="max-w-5xl mx-auto">
            <Link href="/articles" className="inline-flex items-center gap-2 text-sand/60 hover:text-gold text-sm mb-8 transition-colors">
              ← כל המאמרים
            </Link>
            {post.publishedAt && (
              <p className="text-gold/70 text-sm mb-3">
                {new Date(post.publishedAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-xl text-sand/80 leading-relaxed max-w-2xl border-r-4 border-gold/50 pr-5">
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="max-w-5xl mx-auto px-4 -mt-6">
            <div className="relative w-full h-64 md:h-96 rounded-[24px] overflow-hidden shadow-2xl">
              <Image src={imageUrl} alt={post.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 1024px" />
            </div>
          </div>
        )}

        {/* Content + Sidebar */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Article body */}
            <article className="flex-1 min-w-0">
              {docxHtml ? (
                <div
                  className="
                    prose prose-lg max-w-none text-right
                    text-charcoal leading-relaxed
                    [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-ink [&_h1]:mt-10 [&_h1]:mb-5
                    [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:mt-8 [&_h2]:mb-4
                    [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:mt-6 [&_h3]:mb-3
                    [&_p]:mb-5 [&_p]:text-[1.05rem] [&_p]:leading-[1.9]
                    [&_ul]:list-disc [&_ul]:list-inside [&_ul]:mb-5 [&_ul]:space-y-2
                    [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:mb-5 [&_ol]:space-y-2
                    [&_li]:text-[1.05rem] [&_li]:leading-relaxed
                    [&_strong]:font-bold [&_strong]:text-ink
                    [&_em]:italic [&_em]:text-charcoal
                    [&_blockquote]:border-r-4 [&_blockquote]:border-gold/50 [&_blockquote]:pr-5 [&_blockquote]:my-6 [&_blockquote]:text-charcoal/80 [&_blockquote]:italic
                    [&_table]:w-full [&_table]:border-collapse [&_table]:mb-6
                    [&_th]:bg-cream [&_th]:font-bold [&_th]:text-ink [&_th]:p-3 [&_th]:border [&_th]:border-gold/20
                    [&_td]:p-3 [&_td]:border [&_td]:border-gold/20
                    [&_a]:text-sienna [&_a]:underline [&_a]:hover:text-gold
                    [&_img]:rounded-xl [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-6
                  "
                  dangerouslySetInnerHTML={{ __html: docxHtml }}
                />
              ) : post.body ? (
                <div className="prose prose-lg max-w-none text-right text-charcoal [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink">
                  <PortableText value={post.body} />
                </div>
              ) : (
                <p className="text-mist text-lg">תוכן המאמר בקרוב...</p>
              )}
            </article>

            {/* Floating gift sidebar */}
            <ArticleGiftSidebar />
          </div>
        </div>
      </div>
    </>
  )
}
