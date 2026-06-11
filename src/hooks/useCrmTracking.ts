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

  const track = useCallback(async (eventType: string, eventData?: Record<string, unknown>): Promise<string | undefined> => {
    const visitorId = visitorIdRef.current
    if (!visitorId) return undefined

    // Don't pollute prod CRM data with dev traffic.
    // Set localStorage crm_track_debug=1 to test tracking locally.
    const host = window.location.hostname
    if ((host === 'localhost' || host === '127.0.0.1') && localStorage.getItem('crm_track_debug') !== '1') {
      return undefined
    }

    const res = await fetch('/api/crm/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        eventType,
        pageUrl: window.location.href,
        referrer: document.referrer || undefined,
        eventData: eventData ?? undefined,
      }),
    }).catch(() => undefined)

    if (!res) return undefined
    const data = await res.json().catch(() => undefined)
    return data?.eventId != null ? String(data.eventId) : undefined
  }, [])

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

  return { track, saveCustomer }
}
