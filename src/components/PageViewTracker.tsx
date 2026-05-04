'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCrmTracking } from '@/hooks/useCrmTracking'

export default function PageViewTracker() {
  const pathname = usePathname()
  const { trackPageView } = useCrmTracking()

  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean)
    const slug = segments.at(-1) || undefined
    trackPageView(slug)
  }, [pathname, trackPageView])

  return null
}
