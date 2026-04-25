import { NextRequest } from 'next/server'
import { sendEmail } from '@/lib/ses'

export interface SendMailPayload {
  to: string | string[]
  subject: string
  htmlBody: string
  textBody?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SendMailPayload = await request.json()

    if (!body.to || !body.subject || !body.htmlBody) {
      return Response.json(
        { success: false, message: 'to, subject, and htmlBody are required' },
        { status: 400 }
      )
    }

    const result = await sendEmail({
      to: body.to,
      subject: body.subject,
      htmlBody: body.htmlBody,
      textBody: body.textBody,
    })

    return Response.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return Response.json({ success: false, message }, { status: 500 })
  }
}
