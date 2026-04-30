import type { Metadata } from 'next'
import { fetchBlogPosts } from '@/lib/queries'
import SectionDivider from '@/components/ui/SectionDivider'
import ArticlesClient from './ArticlesClient'

export const metadata: Metadata = {
  title: 'מאמרים | טל רומן',
  description: 'מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.',
}

export default async function ArticlesPage() {
  const posts = await fetchBlogPosts().catch(() => [])

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-3">מאמרים</h1>
        <p className="text-charcoal text-xl mb-6 leading-relaxed">מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.</p>
        <div className="mb-10">
          <SectionDivider />
        </div>

        {posts.length === 0 ? (
          <p className="text-mist text-lg text-center py-20">מאמרים בקרוב...</p>
        ) : (
          <ArticlesClient posts={posts} />
        )}
      </div>
    </div>
  )
}
