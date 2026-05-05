import { NextRequest } from 'next/server'
import { crmSaveCustomer, type CrmCustomerData } from '@/lib/crm-client'

export async function POST(request: NextRequest) {
  try {
    const body: CrmCustomerData & { location?: { lat: number; lng: number; accuracy?: number } } =
      await request.json()

    const { location, ...rawCustomerData } = body

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

    const tags = [customerData.tag, location ? `geo:${location.lat},${location.lng}` : undefined]
      .filter((t): t is string => !!t?.trim())

    const payload: CrmCustomerData = {
      ...customerData,
      tag: tags.length ? tags.join(',') : undefined,
    }

    void eventData

    const result = await crmSaveCustomer(payload)

    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
