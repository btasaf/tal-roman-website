'use client'

import { usePathname } from 'next/navigation'
import { usePageView } from '@/hooks/usePageView'

export default function PageViewTracker() {
  const pathname = usePathname()
  // The v2 redesign lives under /v2 until launch; drop the prefix so it reports the same event names as the live pages
  const all = pathname.split('/').filter(Boolean)
  const segments = all[0] === 'v2' ? all.slice(1) : all
  const slug = segments.at(-1) || undefined
  const prefixMap: Record<string, string> = { gifts: 'gifts', articles: 'articles', p: 'p' }
  const prefix = segments[0] ? prefixMap[segments[0]] : undefined

  usePageView(slug, prefix)
  return null
}
