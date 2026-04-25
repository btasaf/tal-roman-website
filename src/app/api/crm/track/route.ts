import { NextRequest } from 'next/server'
import { crmTrackEvent, type CrmTrackEventData } from '@/lib/crm-client'

export interface TrackPayload {
  visitorId: string
  eventType: string
  pageUrl?: string
  referrer?: string
  location?: {
    lat: number
    lng: number
    accuracy?: number
    city?: string
    country?: string
  }
  extra?: Record<string, unknown>
}

export async function POST(request: NextRequest) {
  try {
    const body: TrackPayload = await request.json()

    if (!body.visitorId || !body.eventType) {
      return Response.json(
        { success: false, message: 'visitorId and eventType are required' },
        { status: 400 }
      )
    }

    const eventData: Record<string, unknown> = { ...body.extra }
    if (body.location) {
      eventData.location = body.location
    }

    const payload: CrmTrackEventData = {
      visitorId: body.visitorId,
      eventType: body.eventType,
      pageUrl: body.pageUrl,
      referrer: body.referrer,
      eventData: Object.keys(eventData).length > 0 ? eventData : undefined,
    }

    const result = await crmTrackEvent(payload)
    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
