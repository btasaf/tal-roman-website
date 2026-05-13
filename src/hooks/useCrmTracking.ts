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

export interface SaveCustomerData {
  firstname?: string
  lastname?: string
  name?: string
  mail?: string
  phone?: string
  tag?: string
  status?: string
  enrollToSchool?: string
  notifyTal?: boolean
  freeText?: string
  emailConsent?: boolean
}

export function useCrmTracking() {
  const visitorIdRef = useRef<string | null>(null)

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId()
  }, [])

  const track = useCallback(async (eventType: string, eventData?: Record<string, unknown>) => {
    const visitorId = visitorIdRef.current
    if (!visitorId) return

    await fetch('/api/crm/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        eventType,
        pageUrl: window.location.href,
        referrer: document.referrer || undefined,
        eventData: eventData ?? undefined,
      }),
    }).catch(() => {})
  }, [])

  const trackPageView = useCallback((slug?: string, prefix?: string) => {
    const parts = ['page-view', prefix, slug].filter(Boolean)
    const label = parts.length > 1 ? parts.join('/') : 'page-view/main-page'
    track(label)
  }, [track])


  const saveCustomer = useCallback(async (data: SaveCustomerData) => {
    const visitorId = visitorIdRef.current

    const res = await fetch('/api/crm/save-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        visitorId: visitorId ?? undefined,
      }),
    })

    return res.json()
  }, [])

  return { track, trackPageView, saveCustomer }
}
