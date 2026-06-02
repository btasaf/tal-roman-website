'use client'

import { useEffect, useRef } from 'react'
import { useCrmTracking } from './useCrmTracking'

export function usePageView(slug?: string, prefix?: string) {
  const { track } = useCrmTracking()
  const eventIdRef = useRef<string | null>(null)
  const startTimeRef = useRef<number>(0)
  const maxScrollRef = useRef<number>(0)
  const hiddenAccumRef = useRef<number>(0)
  const hiddenSinceRef = useRef<number | null>(null)
  const hasSentRef = useRef<boolean>(false)

  useEffect(() => {
    const parts = ['page-view', prefix, slug].filter(Boolean)
    const label = parts.length > 1 ? parts.join('/') : 'page-view/main-page'

    startTimeRef.current = Date.now()
    maxScrollRef.current = 0
    hiddenAccumRef.current = 0
    hiddenSinceRef.current = null
    hasSentRef.current = false
    eventIdRef.current = null

    const getDepth = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return 100
      return Math.min(100, Math.round((window.scrollY / scrollable) * 100))
    }

    const handleScroll = () => {
      const depth = getDepth()
      if (depth > maxScrollRef.current) maxScrollRef.current = depth
    }
    handleScroll() // capture scroll position if browser restored scroll on navigation
    window.addEventListener('scroll', handleScroll, { passive: true })

    void track(label).then(id => { if (id) eventIdRef.current = id }).catch(() => {})

    const getActiveSeconds = () => {
      const now = Date.now()
      const hiddenNow = hiddenSinceRef.current ? now - hiddenSinceRef.current : 0
      return Math.round((now - startTimeRef.current - hiddenAccumRef.current - hiddenNow) / 1000)
    }

    const sendEngagement = () => {
      if (hasSentRef.current) return
      const eventId = eventIdRef.current
      if (!eventId) return
      hasSentRef.current = true

      navigator.sendBeacon(
        `/api/crm/track/${eventId}`,
        new Blob(
          [JSON.stringify({ eventData: {
            timeOnPageSeconds: getActiveSeconds(),
            maxScrollDepthPercent: maxScrollRef.current,
          }})],
          { type: 'application/json' }
        )
      )
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        hiddenSinceRef.current = Date.now()
        sendEngagement() // checkpoint save in case user doesn't come back
      } else {
        if (hiddenSinceRef.current) {
          hiddenAccumRef.current += Date.now() - hiddenSinceRef.current
          hiddenSinceRef.current = null
        }
        hasSentRef.current = false // allow re-send on real exit with accurate time
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', sendEngagement)

    return () => {
      sendEngagement()
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('beforeunload', sendEngagement)
    }
  // track is a stable useCallback ref — safe to omit from deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, prefix])
}
