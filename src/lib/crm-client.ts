const CRM_BASE_URL = process.env.CRM_BASE_URL || 'http://localhost:5000'

export interface CrmCustomerData {
  firstname?: string
  lastname?: string
  name?: string
  mail?: string
  phone?: string
  tag?: string
  status?: string
  enrollToSchool?: string
  visitorId?: string
}

export interface CrmTrackEventData {
  visitorId: string
  eventType: string
  eventData?: Record<string, unknown>
  pageUrl?: string
  referrer?: string
}

export interface CrmSaveResult {
  success: boolean
  message: string
  customerId?: number
  isNewCustomer?: boolean
  tagsAdded?: { id: number; name: string }[]
  uniqueLink?: string
}

export interface CrmTrackResult {
  success: boolean
  eventId?: number
  timestamp?: string
}

export async function crmSaveCustomer(data: CrmCustomerData): Promise<CrmSaveResult> {
  if (!data.mail && !data.phone) {
    throw new Error('Either mail or phone is required')
  }

  const res = await fetch(`${CRM_BASE_URL}/api/wix/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`CRM save failed (${res.status}): ${text}`)
  }

  const json = await res.json()
  return {
    success: true,
    message: json.message,
    customerId: json.result?.customerId,
    isNewCustomer: json.result?.isNewCustomer,
    tagsAdded: json.result?.tagsAdded,
    uniqueLink: json.uniqueLink,
  }
}

export async function crmTrackEvent(data: CrmTrackEventData): Promise<CrmTrackResult> {
  const res = await fetch(`${CRM_BASE_URL}/api/wix/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`CRM track failed (${res.status}): ${text}`)
  }

  return await res.json()
}
