import type { Metadata } from 'next'
import { fetchBlogPosts } from '@/lib/queries'
import PageHero from '@/components/ui/PageHero'
import ArticlesClient from './ArticlesClient'

export const metadata: Metadata = {
  title: 'מאמרים | טל רומן',
  description: 'מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט.',
}

export default async function ArticlesPage() {
  const posts = await fetchBlogPosts().catch(() => [])

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <PageHero
        title="מאמרים"
        subtitle="מחשבות, תובנות, ותשובות לשאלות שאנשים שואלים בשקט."
      />

      <div className="max-w-4xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <p className="text-mist text-lg text-center py-20">מאמרים בקרוב...</p>
        ) : (
          <ArticlesClient posts={posts} showSearch={posts.length >= 5} />
        )}
      </div>
    </div>
  )
}
