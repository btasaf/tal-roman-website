/**
 * One-time Wix CMS → Sanity migration script.
 *
 * Run with:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=xxx NEXT_PUBLIC_SANITY_DATASET=production SANITY_WRITE_TOKEN=xxx \
 *   npx ts-node --esm -e '{}' scripts/migrate-from-wix.ts
 *
 * Or load from .env.local:
 *   node -e "require('fs').readFileSync('.env.local','utf8').split('\n').forEach(l=>{const[k,...v]=l.split('=');if(k)process.env[k.trim()]=v.join('=').trim()})" \
 *   && npx ts-node scripts/migrate-from-wix.ts
 *
 * Idempotent: skips documents that already exist by _id.
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ─── Env loader (reads .env.local if present) ────────────────────────────────
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !process.env[key]) process.env[key] = val
  }
}
loadEnv()

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const CSV_DIR = path.join(process.cwd(), 'wix csv cms')

// ─── CSV Parser ───────────────────────────────────────────────────────────────
function parseCSV(filePath: string): Record<string, string>[] {
  let content = fs.readFileSync(filePath, 'utf8')
  if (content.charCodeAt(0) === 0xfeff) content = content.slice(1)

  let pos = 0

  function parseField(): string {
    if (content[pos] === '"') {
      pos++
      let result = ''
      while (pos < content.length) {
        if (content[pos] === '"') {
          if (content[pos + 1] === '"') {
            result += '"'
            pos += 2
          } else {
            pos++
            break
          }
        } else {
          result += content[pos++]
        }
      }
      return result
    } else {
      let result = ''
      while (pos < content.length && content[pos] !== ',' && content[pos] !== '\n' && content[pos] !== '\r') {
        result += content[pos++]
      }
      return result
    }
  }

  function parseRow(): string[] {
    const fields: string[] = []
    while (pos < content.length) {
      fields.push(parseField())
      if (pos >= content.length) break
      if (content[pos] === ',') { pos++; continue }
      if (content[pos] === '\r') pos++
      if (content[pos] === '\n') pos++
      break
    }
    return fields
  }

  const headers = parseRow()
  const records: Record<string, string>[] = []

  while (pos < content.length) {
    while (pos < content.length && (content[pos] === '\r' || content[pos] === '\n')) pos++
    if (pos >= content.length) break
    const values = parseRow()
    if (values.every(v => !v)) continue
    const record: Record<string, string> = {}
    headers.forEach((h, i) => { record[h] = values[i] ?? '' })
    records.push(record)
  }

  return records
}

// ─── Wix Image URL → CDN URL ──────────────────────────────────────────────────
function wixUrlToCdn(wixUrl: string): string | null {
  if (!wixUrl || !wixUrl.startsWith('wix:image://v1/')) return null
  const withoutProtocol = wixUrl.slice('wix:image://v1/'.length)
  const withoutFragment = withoutProtocol.split('#')[0]
  const mediaFile = withoutFragment.split('/')[0]
  return `https://static.wixstatic.com/media/${mediaFile}`
}

// ─── Image Upload Cache ───────────────────────────────────────────────────────
const imageCache = new Map<string, string>()

async function uploadWixImage(wixUrl: string): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  if (!wixUrl) return null
  const cdnUrl = wixUrlToCdn(wixUrl)
  if (!cdnUrl) return null

  if (imageCache.has(cdnUrl)) {
    return { _type: 'image', asset: { _type: 'reference', _ref: imageCache.get(cdnUrl)! } }
  }

  try {
    const response = await fetch(cdnUrl)
    if (!response.ok) {
      console.warn(`    ⚠ Failed to fetch image (${response.status}): ${cdnUrl}`)
      return null
    }
    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') || guessContentType(cdnUrl)
    const filename = path.basename(cdnUrl.split('?')[0])

    const asset = await client.assets.upload('image', buffer, { filename, contentType })
    imageCache.set(cdnUrl, asset._id)
    console.log(`    ↑ uploaded: ${filename}`)
    return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  } catch (err: any) {
    console.warn(`    ⚠ Image upload failed for ${cdnUrl}: ${err.message}`)
    return null
  }
}

function guessContentType(url: string): string {
  if (url.endsWith('.png')) return 'image/png'
  if (url.endsWith('.jpg') || url.endsWith('.jpeg')) return 'image/jpeg'
  if (url.endsWith('.webp')) return 'image/webp'
  if (url.endsWith('.avif')) return 'image/avif'
  return 'image/jpeg'
}

// ─── Sanity Upsert ────────────────────────────────────────────────────────────
async function upsert(doc: Record<string, unknown>) {
  const existing = await client.fetch(`*[_id == $id][0]._id`, { id: doc._id })
  if (existing) {
    console.log(`  skip (exists): ${doc._id}`)
    return
  }
  await client.createIfNotExists(doc as any)
  console.log(`  created: ${doc._id}`)
}

// ─── Text → Portable Text block ───────────────────────────────────────────────
function toBlock(text: string, key: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: `${key}s`, text: text.trim() }],
  }
}

// ─── Slug from Hebrew title ───────────────────────────────────────────────────
function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 96)
}

// ─── Known product metadata (type + featured + order) ────────────────────────
const PRODUCT_META: Record<string, { type: string; featured: boolean; order: number }> = {
  '2691802f-a3dd-4e15-b6ec-91323f59d7f0': { type: 'workshop', featured: true, order: 1 },
  'e0530ff3-1432-4a5f-ae63-d4f012d93f16': { type: 'workshop', featured: true, order: 2 },
  '592a42dc-9ee7-483e-93fd-1b8679328c0e': { type: 'digital',  featured: true, order: 3 },
  'bd959509-377c-483c-b6a8-5542d7138291': { type: 'digital',  featured: false, order: 4 },
  'e4d14569-3e0b-46f0-adb6-1dcab3065f8d': { type: 'workshop', featured: false, order: 5 },
  'b3a3d4d4-a007-40d9-a157-4d8e7c79d06f': { type: 'personal', featured: false, order: 6 },
}

// ─── Media source inference ───────────────────────────────────────────────────
function inferSource(url: string, logoAlt: string): string {
  const all = (url + ' ' + logoAlt).toLowerCase()
  if (all.includes('ynet')) return 'ynet'
  if (all.includes('mako')) return 'mako'
  if (all.includes('sheee') || all.includes('וואלה') || all.includes('walla')) return 'walla'
  if (all.includes('channel12') || all.includes('next') || all.includes('12')) return 'channel12'
  if (all.includes('sexapil') || all.includes('סקסאפיל')) return 'sexapil'
  if (all.includes('atmag') || all.includes('את')) return 'et'
  if (all.includes('kan') || all.includes('כאן')) return 'other'
  return 'other'
}

function inferMediaType(linkText: string, url: string): string {
  const t = linkText.toLowerCase()
  if (t.includes('האזנ') || url.includes('spotify') || url.includes('podcast') || url.includes('summur') || url.includes('youtube')) return 'podcast'
  if (t.includes('צפי') || url.includes('ynet.co.il/dating/sex')) return 'video'
  if (url.includes('youtube.com') || url.includes('mako.co.il/nexter') || url.includes('kan.org')) return 'video'
  return 'article'
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== Wix → Sanity Migration ===\n')

  // ── Parse all CSVs ──────────────────────────────────────────────────────────
  console.log('Parsing CSVs...')
  const products     = parseCSV(path.join(CSV_DIR, 'מוצרים.csv'))
  const details      = parseCSV(path.join(CSV_DIR, 'פרטים+נוספים+למוצרים+_.csv'))
  const listItems    = parseCSV(path.join(CSV_DIR, 'רשימות+מוצרים+_.csv'))
  const faqs         = parseCSV(path.join(CSV_DIR, '_שאלות+ותשובות+למוצרים.csv'))
  const testimonials = parseCSV(path.join(CSV_DIR, 'המלצות.csv'))
  const media        = parseCSV(path.join(CSV_DIR, 'תקשורת.csv'))

  console.log(`  products: ${products.length}, details: ${details.length}, listItems: ${listItems.length}`)
  console.log(`  faqs: ${faqs.length}, testimonials: ${testimonials.length}, media: ${media.length}`)

  // Build lookup maps
  const detailsByProductId = new Map<string, typeof details[0]>()
  for (const d of details) {
    if (d['Reference']) detailsByProductId.set(d['Reference'], d)
  }

  const listItemsByProductId = new Map<string, typeof listItems>()
  for (const item of listItems) {
    const refs = parseJsonArray(item['Multi-Reference'])
    for (const ref of refs) {
      if (!listItemsByProductId.has(ref)) listItemsByProductId.set(ref, [])
      listItemsByProductId.get(ref)!.push(item)
    }
  }

  const faqsByProductId = new Map<string, typeof faqs>()
  for (const faq of faqs) {
    const refs = parseJsonArray(faq['Multi-Reference'])
    for (const ref of refs) {
      if (!faqsByProductId.has(ref)) faqsByProductId.set(ref, [])
      faqsByProductId.get(ref)!.push(faq)
    }
  }

  // ── Migrate mediaMentions ───────────────────────────────────────────────────
  console.log('\n--- Media Mentions ---')
  for (const m of media) {
    const id = `wix-media-${m['ID']}`
    console.log(`\n  "${m['Title'].slice(0, 40)}"`)

    const thumbnail = await uploadWixImage(m['תמונה'])
    const logo      = await uploadWixImage(m['Logo'])

    const source = inferSource(m['קישור'], m['הסבר על לוגו'])
    const mediaType = inferMediaType(m['מלל קישור'], m['קישור'])
    const sortNum = parseInt(m['sort'], 10) || 99

    const doc: Record<string, unknown> = {
      _id: id,
      _type: 'mediaMention',
      title: m['Title'],
      upperTitle: m['כותרת עליונה'] || undefined,
      excerpt: m['כותרת עליונה'] || m['Title'],
      linkText: m['מלל קישור'] || undefined,
      externalUrl: m['קישור'],
      source,
      mediaType,
      featured: true,
      order: sortNum,
      wixId: m['ID'],
    }
    if (thumbnail) { doc.thumbnail = thumbnail; doc.thumbnailAlt = m['הסבר על תמונה'] || undefined }
    if (logo) { doc.logo = logo; doc.logoAlt = m['הסבר על לוגו'] || undefined }

    await upsert(doc)
  }

  // ── Migrate Testimonials ────────────────────────────────────────────────────
  console.log('\n--- Testimonials ---')
  for (const t of testimonials) {
    const id = `wix-testimonial-${t['ID']}`
    const nameField = t['name'] || 'אנונימי'
    console.log(`\n  "${nameField}" — ${t['from where']}`)

    const image = await uploadWixImage(t['תמונה'])
    const sort = parseInt(t['sort'], 10) || 5

    const doc: Record<string, unknown> = {
      _id: id,
      _type: 'testimonial',
      name: nameField,
      courseTitle: t['from where'] || undefined,
      body: t['Title'],
      rating: 5,
      featured: false,
      sort,
      wixProductId: t['למי שייך'] || undefined,
      wixId: t['ID'],
    }
    if (image) doc.image = image

    await upsert(doc)
  }

  // ── Migrate Courses ─────────────────────────────────────────────────────────
  console.log('\n--- Courses ---')
  for (const p of products) {
    const wixId = p['ID']
    const id = `wix-course-${wixId}`
    console.log(`\n  "${p['Title']}"`)

    const meta = PRODUCT_META[wixId] ?? { type: 'workshop', featured: false, order: 99 }
    const detail = detailsByProductId.get(wixId)
    const items = listItemsByProductId.get(wixId) ?? []
    const faqList = faqsByProductId.get(wixId) ?? []

    // Images
    const thumbnail = await uploadWixImage(p['Image'])
    const primaryImage = detail ? await uploadWixImage(detail['תמונה ראשית']) : null

    // Description as portable text blocks
    const descriptionBlocks = p['hoverInfo']
      ? p['hoverInfo'].split(/\n\n+/).filter(Boolean).map((para, i) => toBlock(para, `block${i}`))
      : []

    // suitableFor
    const suitableFor = items.map((item, i) => ({
      _type: 'listItem',
      _key: `si${i}`,
      text: item['Title'],
      listType: item['type'] || 'למי זה מתאים',
    }))

    // FAQ
    const faqItems = faqList.map((f, i) => ({
      _type: 'faqItem',
      _key: `faq${i}`,
      question: f['Title'],
      answer: f['תשובה'],
    }))

    const slug = slugify(p['Title']) || wixId.slice(0, 20)

    const doc: Record<string, unknown> = {
      _id: id,
      _type: 'course',
      title: p['Title'],
      slug: { _type: 'slug', current: slug },
      shortDescription: p['subTitle'] || undefined,
      description: descriptionBlocks.length ? descriptionBlocks : undefined,
      active: p['active'] === 'true',
      landingPageUrl: p['link2LandingPage'] || p['לינק זמני לפרטים נוספים'] || undefined,
      type: meta.type,
      featured: meta.featured,
      order: meta.order,
      wixId,
    }

    if (thumbnail) doc.thumbnail = thumbnail

    if (detail) {
      if (primaryImage) doc.primaryImage = primaryImage
      if (detail['עלות'])               doc.price = detail['עלות'].trim()
      if (detail['לינק לקניה'])         doc.purchaseUrl = detail['לינק לקניה'].trim()
      if (detail['איפה'])               doc.location = detail['איפה'].trim()
      if (detail['דמי ביטולים'])        doc.cancellationPolicy = detail['דמי ביטולים'].trim()
      if (detail['הנעה לפעולה'])        doc.ctaText = detail['הנעה לפעולה'].trim()
      if (detail['כפתור הנעה לפעולה']) doc.ctaButtonLabel = detail['כפתור הנעה לפעולה'].trim()
      if (detail['פרטים מלאים על הסדנה'])       doc.fullDetails = detail['פרטים מלאים על הסדנה'].trim()
      if (detail['פסקה מתחת לכותרת משנה'])      doc.paragraphBelowSubtitle = detail['פסקה מתחת לכותרת משנה'].trim()
    }

    if (suitableFor.length) doc.suitableFor = suitableFor
    if (faqItems.length)    doc.faq = faqItems

    await upsert(doc)
  }

  console.log('\n=== Migration complete! ===\n')
  console.log('Uploaded images:', imageCache.size)
}

// ─── Parse Wix JSON array strings ────────────────────────────────────────────
function parseJsonArray(val: string): string[] {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

main().catch(err => {
  console.error('Migration failed:', err)
  process.exit(1)
})
