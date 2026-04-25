import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { fetchBlogPosts } from '@/lib/queries'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = { title: 'מאמרים' }

export default async function ArticlesPage() {
  const posts = await fetchBlogPosts().catch(() => [])

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-4">מאמרים</h1>
        <p className="text-[#4f4f4f] text-xl mb-4">מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.</p>
        <div className="w-16 h-1 bg-[#e6c060] mb-12 rounded-full" />

        {posts.length === 0 && (
          <p className="text-[#6b6b6b] text-lg">מאמרים בקרוב...</p>
        )}

        <div className="space-y-8">
          {posts.map((post: any) => {
            const imgUrl = post.thumbnail ? urlFor(post.thumbnail).width(600).height(300).url() : null
            return (
              <Link
                key={post.slug}
                href={`/articles/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md border border-[#e6c060]/10 transition-shadow"
              >
                {imgUrl && (
                  <div className="relative w-full md:w-56 h-48 md:h-auto flex-shrink-0">
                    <Image src={imgUrl} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 224px" />
                  </div>
                )}
                <div className="p-6 flex flex-col justify-center">
                  {post.publishedAt && (
                    <span className="text-[#6b6b6b] text-sm mb-2">
                      {new Date(post.publishedAt).toLocaleDateString('he-IL')}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-[#303030] mb-2 group-hover:text-[#cd2c2c] transition-colors">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-[#4f4f4f] leading-relaxed line-clamp-2">{post.excerpt}</p>
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
