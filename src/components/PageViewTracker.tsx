'use client'

import { usePathname } from 'next/navigation'
import { usePageView } from '@/hooks/usePageView'

export default function PageViewTracker() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const slug = segments.at(-1) || undefined
  const prefixMap: Record<string, string> = { gifts: 'gifts', articles: 'articles' }
  const prefix = segments[0] ? prefixMap[segments[0]] : undefined

  usePageView(slug, prefix)
  return null
}
