import { NextRequest } from 'next/server'
import { crmSaveCustomer, type CrmCustomerData } from '@/lib/crm-client'

export async function POST(request: NextRequest) {
  try {
    const body: CrmCustomerData & { location?: { lat: number; lng: number; accuracy?: number } } =
      await request.json()

    const { location, ...customerData } = body

    const eventData = location
      ? { geo: location, source: 'website' }
      : { source: 'website' }

    // If location provided, embed it in tag or notes via eventData in customerData
    const payload: CrmCustomerData = {
      ...customerData,
      tag: [customerData.tag, location ? `geo:${location.lat},${location.lng}` : '']
        .filter(Boolean)
        .join(',') || undefined,
    }

    // Remove empty tag
    if (!payload.tag) delete payload.tag

    const result = await crmSaveCustomer(payload)

    // If we also have a visitorId, the CRM wix endpoint already links it
    void eventData // suppress unused warning

    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
