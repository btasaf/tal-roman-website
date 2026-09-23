import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Sanity webhook secret - must match the secret configured in Sanity
const WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

// Map Sanity document types to cache tags
// If a type isn't listed here, we'll generate a tag from the type name automatically
const TYPE_TO_TAGS: Record<string, string[]> = {
  course: ['courses'],
  blogPost: ['blogPosts'],
  gift: ['gifts'],
  freeGift: ['freeGifts'],
  testimonial: ['testimonials'],
  mediaMention: ['mediaMentions'],
  siteSettings: ['siteSettings'],
  homepageSection: ['homepage', 'homepageSection'],
  htmlPage: ['htmlPages'],
}

// Types that appear on the homepage and should trigger homepage revalidation
const HOMEPAGE_TYPES = ['course', 'testimonial', 'freeGift', 'homepageSection', 'mediaMention']

// Verify Sanity webhook signature
// Sanity format: "t=<timestamp>,v1=<signature>" where signature is HMAC-SHA256 of "<timestamp>.<body>"
function isValidSignature(body: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false

  // Parse the header: t=1234567890,v1=abc123...
  const parts: Record<string, string> = {}
  for (const part of signatureHeader.split(',')) {
    const [key, value] = part.split('=')
    if (key && value) parts[key] = value
  }

  const timestamp = parts['t']
  const signature = parts['v1']

  if (!timestamp || !signature) return false

  // Compute expected signature: HMAC-SHA256 of "timestamp.body"
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('base64')
    .replace(/\+/g, '-')  // base64url encoding
    .replace(/\//g, '_')
    .replace(/=+$/, '')   // remove padding

  return signature === expectedSignature
}

export async function POST(request: NextRequest) {
  // Check webhook secret is configured
  if (!WEBHOOK_SECRET) {
    console.error('[revalidate] SANITY_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  // Get raw body for signature verification
  const body = await request.text()
  const signature = request.headers.get('sanity-webhook-signature')

  // Verify signature
  if (!isValidSignature(body, signature, WEBHOOK_SECRET)) {
    console.error('[revalidate] Invalid webhook signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Parse the webhook payload
  let payload: { _type?: string; slug?: string }
  try {
    payload = JSON.parse(body)
  } catch {
    console.error('[revalidate] Invalid JSON payload')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { _type, slug } = payload
  const revalidatedTags: string[] = []

  if (!_type) {
    return NextResponse.json({ error: 'Missing _type in payload' }, { status: 400 })
  }

  // Revalidate tags based on document type
  // Using 'max' profile: serve stale content immediately while revalidating in background
  const tags = TYPE_TO_TAGS[_type] ?? [`${_type}s`] // Fallback: pluralize the type name
  for (const tag of tags) {
    revalidateTag(tag, 'max')
    revalidatedTags.push(tag)
  }

  // Revalidate specific slug tag if available
  if (slug) {
    const slugTag = `${_type}:${slug}`
    revalidateTag(slugTag, 'max')
    revalidatedTags.push(slugTag)
  }

  // Revalidate homepage if this type appears there
  if (HOMEPAGE_TYPES.includes(_type)) {
    revalidateTag('homepage', 'max')
    if (!revalidatedTags.includes('homepage')) {
      revalidatedTags.push('homepage')
    }
  }

  console.log(`[revalidate] Revalidated tags: ${revalidatedTags.join(', ')} for ${_type}${slug ? `:${slug}` : ''}`)

  return NextResponse.json({
    revalidated: true,
    tags: revalidatedTags,
    type: _type,
    slug,
  })
}
