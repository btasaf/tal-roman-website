'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/types'
import { getImageUrl } from '@/lib/image-utils'

export default function ArticlesClient({ posts, showSearch = true }: { posts: BlogPost[], showSearch?: boolean }) {
  const [search, setSearch] = useState('')

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      p.title.toLowerCase().includes(q) ||
      (p.excerpt ?? '').toLowerCase().includes(q)
    )
  })

  return (
    <div dir="rtl">
      {/* Search — only shown when enough posts to make it useful */}
      {showSearch && (
        <div className="relative mb-10">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש מאמרים..."
            className="w-full bg-white border border-gold/25 rounded-full px-6 py-3.5 text-ink placeholder:text-mist text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
          />
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      )}

      {/* Results count */}
      {search.trim() && (
        <p className="text-mist text-sm mb-6">
          {filtered.length} תוצאות עבור &quot;{search}&quot;
        </p>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-20">
          <p className="text-mist text-xl mb-2">לא נמצאו מאמרים</p>
          <button onClick={() => setSearch('')} className="text-sienna text-sm hover:text-gold transition-colors">
            נקה חיפוש
          </button>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-6">
        {filtered.map((post) => {
          const imgUrl = getImageUrl(post.thumbnail, 'media')
          return (
            <Link
              key={post.slug}
              href={`/articles/${post.slug}`}
              className="group flex flex-col md:flex-row gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-gold/10 transition-all duration-300 hover:-translate-y-0.5"
            >
              {imgUrl && (
                <div className="relative w-full md:w-52 h-48 md:h-auto flex-shrink-0">
                  <Image
                    src={imgUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 208px"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col justify-center">
                {post.publishedAt && (
                  <span className="text-mist text-xs mb-2">
                    {new Date(post.publishedAt).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                )}
                <h2 className="text-xl font-bold text-ink mb-2 group-hover:text-sienna transition-colors leading-snug">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-charcoal/80 leading-relaxed line-clamp-2 text-sm">{post.excerpt}</p>
                )}
                <span className="mt-4 text-xs font-semibold text-sienna group-hover:text-gold transition-colors">
                  קרא עוד ←
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Coming soon note when few articles */}
      {!showSearch && posts.length > 0 && (
        <p className="text-mist text-center text-sm mt-12">מאמרים נוספים בקרוב...</p>
      )}
    </div>
  )
}
