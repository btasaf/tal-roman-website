import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogPosts } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import type { BlogPost } from '@/lib/types'
import SectionDivider from '@/components/ui/SectionDivider'

export const metadata: Metadata = { title: 'מאמרים' }

export default async function ArticlesPage() {
  const posts: BlogPost[] = await fetchBlogPosts().catch(() => [])

  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">מאמרים</h1>
        <p className="text-charcoal text-xl mb-4">מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.</p>
        <div className="mb-12">
          <SectionDivider />
        </div>

        {posts.length === 0 && (
          <p className="text-mist text-lg">מאמרים בקרוב...</p>
        )}

        <div className="space-y-8">
          {posts.map((post) => {
            const imgUrl = getImageUrl(post.thumbnail, 'media')
            return (
              <Link
                key={post.slug}
                href={`/articles/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md border border-gold/10 transition-shadow"
              >
                {imgUrl && (
                  <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                    <Image src={imgUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 224px" />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  {post.publishedAt && (
                    <span className="text-mist text-sm mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-charcoal leading-relaxed line-clamp-2">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
