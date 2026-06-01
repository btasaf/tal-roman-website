import { NextRequest } from 'next/server'
import { crmUpdateEvent, type CrmUpdateEventData } from '@/lib/crm-client'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const { eventId } = await params
    const body: CrmUpdateEventData = await request.json()

    await crmUpdateEvent(eventId, body)
    return Response.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
