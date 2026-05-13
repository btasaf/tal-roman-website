'use client'

import { useEffect } from 'react'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface Props {
  slug: string
}

export default function ArticleViewTracker({ slug }: Props) {
  const { track } = useCrmTracking()

  useEffect(() => {
    track(`article-view/${slug}`)
  }, [slug, track])

  return null
}
