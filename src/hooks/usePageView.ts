'use client'

import { useEffect, useRef } from 'react'
import { useCrmTracking } from './useCrmTracking'

export function usePageView(slug?: string, prefix?: string) {
  const { track } = useCrmTracking()
  const eventIdRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(0)
  const maxScrollRef = useRef<number>(0)

  useEffect(() => {
    const parts = ['page-view', prefix, slug].filter(Boolean)
    const label = parts.length > 1 ? parts.join('/') : 'page-view/main-page'

    startTimeRef.current = Date.now()
    maxScrollRef.current = 0

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight
      const total = document.documentElement.scrollHeight
      const depth = Math.round((scrolled / total) * 100)
      if (depth > maxScrollRef.current) maxScrollRef.current = depth
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // capture initial viewport

    void track(label).then(id => { if (id) eventIdRef.current = id }).catch(() => {})

    let hasSent = false
    const sendEngagement = () => {
      if (hasSent) return
      const eventId = eventIdRef.current
      if (!eventId) return
      hasSent = true

      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000)
      navigator.sendBeacon(
        `/api/crm/track/${eventId}`,
        new Blob(
          [JSON.stringify({ eventData: { timeOnPageSeconds: timeOnPage, maxScrollDepthPercent: maxScrollRef.current } })],
          { type: 'application/json' }
        )
      )
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') sendEngagement()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', sendEngagement)

    return () => {
      sendEngagement() // fires on Next.js client navigation (component unmount)
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', sendEngagement)
    }
  // track is a stable useCallback ref — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, prefix])
}
