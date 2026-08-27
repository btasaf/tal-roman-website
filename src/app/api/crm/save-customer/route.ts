import { NextRequest } from 'next/server'
import { crmSaveCustomer, type CrmCustomerData } from '@/lib/crm-client'

export async function POST(request: NextRequest) {
  try {
    const body: CrmCustomerData & {
      location?: { lat: number; lng: number; accuracy?: number }
      tags?: string[]
    } = await request.json()

    const { location, tags: tagsArray, ...rawCustomerData } = body

    const eventData = location
      ? { geo: location, source: 'website' }
      : { source: 'website' }

    const trim = (v?: string | null) => v?.trim() || undefined

    const customerData = {
      ...rawCustomerData,
      name:          trim(rawCustomerData.name),
      mail:          trim(rawCustomerData.mail),
      phone:         trim(rawCustomerData.phone),
      tag:           trim(rawCustomerData.tag),
      status:        trim(rawCustomerData.status),
      enrollToSchool: trim(rawCustomerData.enrollToSchool),
    }

    // Combine single tag, tags array, and geo tag
    const allTags = [
      customerData.tag,
      ...(tagsArray || []),
      location ? `geo:${location.lat},${location.lng}` : undefined,
    ].filter((t): t is string => !!t?.trim())

    const payload: CrmCustomerData = {
      ...customerData,
      tag: allTags.length ? allTags.join(',') : undefined,
    }

    void eventData

    const result = await crmSaveCustomer(payload)

    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
