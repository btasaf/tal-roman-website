import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { fetchBlogPostBySlug, fetchBlogPosts } from '@/lib/queries'
import { urlFor } from '@/sanity/client'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const posts = await fetchBlogPosts().catch(() => [])
  const params = posts.map((p: any) => ({ slug: p.slug }))
  return params.length > 0 ? params : [{ slug: '__placeholder__' }]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug).catch(() => null)
  if (!post) return { title: 'מאמר לא נמצא' }
  return { title: post.title, description: post.excerpt }
}

export default async function ArticleDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await fetchBlogPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const imageUrl = post.thumbnail ? urlFor(post.thumbnail).width(1200).height(600).url() : null

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {post.publishedAt && (
          <p className="text-[#6b6b6b] text-sm mb-4">
            {new Date(post.publishedAt).toLocaleDateString('he-IL')}
          </p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-6">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-[#4f4f4f] mb-8 leading-relaxed border-r-4 border-[#e6c060] pr-4">
            {post.excerpt}
          </p>
        )}
        {imageUrl && (
          <div className="relative w-full h-72 md:h-96 rounded-[24px] overflow-hidden mb-10 shadow-lg">
            <Image src={imageUrl} alt={post.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}
        {post.body && (
          <div className="prose prose-lg max-w-none text-[#4f4f4f] [&_h2]:text-[#303030] [&_h3]:text-[#303030] [&_strong]:text-[#303030]">
            <PortableText value={post.body} />
          </div>
        )}
      </div>
    </div>
  )
}
