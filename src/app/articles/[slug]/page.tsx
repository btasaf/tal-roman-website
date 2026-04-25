import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import type { BlogPost } from '@/lib/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts: BlogPost[] = await fetchBlogPosts().catch(() => [])
  const params = posts.map((p) => ({ slug: p.slug }))
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post: BlogPost | null = await fetchBlogPostBySlug(slug).catch(() => null)
  if (!post) return { title: 'מאמר לא נמצא' }
  return { title: post.title, description: post.excerpt }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const post: BlogPost | null = await fetchBlogPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const imageUrl = getImageUrl(post.thumbnail, 'detail')

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {post.publishedAt && (
          <p className="text-mist text-sm mb-4">
            {new Date(post.publishedAt).toLocaleDateString('he-IL')}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-6">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-charcoal mb-8 leading-relaxed border-r-4 border-gold pr-4">
            {post.excerpt}
          </p>
        )}
        {imageUrl && (
          <div className="relative w-full h-72 md:h-96 rounded-[24px] overflow-hidden mb-10 shadow-lg">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}
        {post.body && (
          <div className="prose prose-lg max-w-none text-charcoal [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink">
            <PortableText value={post.body} />
          </div>
        )}
      </div>
    </div>
  )
}
