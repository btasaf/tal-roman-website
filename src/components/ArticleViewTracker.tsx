'use client'

import { useEffect } from 'react'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface Props {
  slug: string
  title: string
}

export default function ArticleViewTracker({ slug, title }: Props) {
  const { track } = useCrmTracking()

  useEffect(() => {
    track('article_view', { articleSlug: slug, articleTitle: title })
  }, [slug, title, track])

  return null
}
