'use client'

import { useEffect, useRef, useCallback } from 'react'

const CRM_BASE = process.env.NEXT_PUBLIC_CRM_URL ?? 'https://crm.talroman.com/api'

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

    await fetch(`${CRM_BASE}/wix/track`, {
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

  const trackPageView = useCallback((slug?: string) => {
    const label = slug ? `page_view_${slug}` : 'page_view_main_page'
    track(label)
  }, [track])


  const saveCustomer = useCallback(async (data: SaveCustomerData) => {
    const visitorId = visitorIdRef.current

    const res = await fetch(`${CRM_BASE}/wix/customer`, {
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
