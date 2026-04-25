'use client'

import { useEffect, useRef, useCallback } from 'react'

function getOrCreateVisitorId(): string {
  const KEY = 'crm_visitor_id'
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

interface GeoLocation {
  lat: number
  lng: number
  accuracy?: number
}

interface TrackOptions {
  eventType: string
  extra?: Record<string, unknown>
  withLocation?: boolean
}

export function useCrmTracking() {
  const visitorIdRef = useRef<string | null>(null)
  const locationRef = useRef<GeoLocation | null>(null)
  const locationFetched = useRef(false)

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId()
  }, [])

  const fetchLocation = useCallback((): Promise<GeoLocation | null> => {
    if (locationFetched.current) return Promise.resolve(locationRef.current)
    locationFetched.current = true

    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: GeoLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          }
          locationRef.current = loc
          resolve(loc)
        },
        () => resolve(null),
        { timeout: 5000, maximumAge: 60000 }
      )
    })
  }, [])

  const track = useCallback(
    async ({ eventType, extra, withLocation = false }: TrackOptions) => {
      const visitorId = visitorIdRef.current
      if (!visitorId) return

      let location: GeoLocation | null = null
      if (withLocation) {
        location = await fetchLocation()
      }

      await fetch('/api/crm/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitorId,
          eventType,
          pageUrl: window.location.href,
          referrer: document.referrer || undefined,
          location: location ?? undefined,
          extra,
        }),
      }).catch(() => {})
    },
    [fetchLocation]
  )

  const trackPageView = useCallback(() => {
    track({ eventType: 'page_view' })
  }, [track])

  const trackFormStart = useCallback((formName: string) => {
    track({ eventType: 'form_start', extra: { formName } })
  }, [track])

  const trackFormSubmit = useCallback(
    (formName: string, withLocation = false) => {
      track({ eventType: 'form_submit', extra: { formName }, withLocation })
    },
    [track]
  )

  const saveCustomer = useCallback(
    async (data: {
      firstname?: string
      lastname?: string
      name?: string
      mail?: string
      phone?: string
      tag?: string
      withLocation?: boolean
    }) => {
      const visitorId = visitorIdRef.current
      const { withLocation = false, ...customerData } = data

      let location: GeoLocation | null = null
      if (withLocation) {
        location = await fetchLocation()
      }

      const res = await fetch('/api/crm/save-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...customerData,
          visitorId: visitorId ?? undefined,
          location: location ?? undefined,
        }),
      })

      return res.json()
    },
    [fetchLocation]
  )

  return { track, trackPageView, trackFormStart, trackFormSubmit, saveCustomer, fetchLocation }
}
