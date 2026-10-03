import 'server-only'
import mammoth from 'mammoth'
import type { BlogPost } from '@/lib/types'

// Server-side preparation of an article for the v2 pages: the same content the old page renders
// (Word file from Sanity converted with mammoth, or Portable Text), cleaned up for the new typography,
// plus the derived data the page shows (table of contents, reading time, FAQ for structured data).

export const SITE = 'https://www.talroman.com'

function toV2(url: string): string {
  try {
    const u = new URL(url)
    return `/v2${u.pathname === '/' ? '' : u.pathname.replace(/\/$/, '')}${u.search}${u.hash}`
  } catch {
    return url
  }
}

export const AUTHOR = 'טל רומן'
export const OG_FALLBACK = '/og-image.jpg'

export type PtBlock = NonNullable<BlogPost['body']>[number]

export interface TocItem {
  id: string
  text: string
}

export type BodySegment = { kind: 'html'; html: string } | { kind: 'pt'; blocks: PtBlock[] }

export interface PreparedArticle {
  /** Body split in two around the in-article invitation (second part may be missing on short articles) */
  segments: BodySegment[]
  toc: TocItem[]
  /** Heading ids for Portable Text h2 blocks, by block _key */
  ptHeadingIds: Record<string, string>
  words: number
  minutes: number
  faq: { question: string; answer: string }[]
}

// ─── Text helpers ────────────────────────────────────────────────────────────

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" }

export function htmlToText(html: string) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#?\w+);/g, (m, e: string) => ENTITIES[e] ?? (e.startsWith('#') ? String.fromCharCode(Number(e.slice(1))) : m))
    .replace(/\s+/g, ' ')
    .trim()
}

// Table-of-contents label: no trailing dash or colon left over from a heading that continues in the text
const tocText = (t: string) => t.replace(/[\s\-–—:]+$/, '')

function countWords(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

// Hebrew prose reads at roughly 200 words a minute
export function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(iso?: string) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('he-IL', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jerusalem' })
}

export function minutesLabel(minutes: number) {
  return minutes === 1 ? 'דקת קריאה' : `${minutes} דקות קריאה`
}

// ─── Word file → HTML (same conversion and link handling as the old article page) ──

function processHyperlinks(html: string): string {
  return html.replace(/<a\s+href="(https?:\/\/[^"]+)"/g, (_, url) => {
    const isInternal = url.includes('talroman.com')
    // Links to our own site stay inside v2 while it lives under /v2 (drop the prefix at launch)
    if (isInternal) return `<a href="${toV2(url)}"`
    return `<a href="${url}" target="_blank" rel="noopener noreferrer"`
  })
}

export async function parseDocx(url: string): Promise<string | null> {
  try {
    // The asset URL is content-addressed (a new upload gets a new URL), so it is safe to cache
    const res = await fetch(url, { cache: 'force-cache' })
    if (!res.ok) return null
    const buffer = Buffer.from(await res.arrayBuffer())
    const { value } = await mammoth.convertToHtml({ buffer })
    return value ? processHyperlinks(value) : null
  } catch (err) {
    console.error('[v2 article] parseDocx failed:', err)
    return null
  }
}

// Clean the converted HTML for the page: the page has its own H1, so the Word title goes and any other
// H1 becomes a section heading; section headings get anchors for the table of contents.
function shapeHtml(raw: string) {
  let html = raw
    .replace(/<a id="[^"]*"><\/a>/g, '') // Google Docs bookmark anchors
    .replace(/<p>\s*<\/p>/g, '')
    .trim()

  // The document's own title duplicates the page H1
  html = html.replace(/^<h1>[\s\S]*?<\/h1>/, '')
  html = html.replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>')

  // Headings are bold by design; drop a <strong> that wraps the whole heading
  html = html.replace(/<(h[2-4])>\s*<strong>([\s\S]*?)<\/strong>\s*<\/\1>/g, '<$1>$2</$1>')

  // A paragraph that is entirely emphasis (a quoted line, a note to the reader) gets its own upright style
  html = html.replace(/<p><em>((?:(?!<\/em>)[\s\S])*)<\/em><\/p>/g, '<p data-voice>$1</p>')

  // Tables scroll inside their own box instead of widening the page; images load lazily
  html = html.replace(/<table/g, '<div data-table><table').replace(/<\/table>/g, '</table></div>')
  html = html.replace(/<img /g, '<img loading="lazy" decoding="async" ')

  const toc: TocItem[] = []
  html = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const id = `section-${toc.length + 1}`
    toc.push({ id, text: tocText(htmlToText(inner)) })
    return `<h2 id="${id}">${inner}</h2>`
  })

  return { html, toc }
}

// FAQ section ("שאלות נפוצות"): each H3 is a question, the text until the next heading its answer
function extractFaqFromHtml(html: string) {
  const start = html.search(/<h2 id="[^"]+">[^<]*שאלות נפוצות/)
  if (start === -1) return []
  const rest = html.slice(start)
  const next = rest.indexOf('<h2', 4)
  const section = next === -1 ? rest : rest.slice(0, next)
  return section
    .split('<h3>')
    .slice(1)
    .map((chunk) => {
      const [q, a = ''] = chunk.split('</h3>')
      return { question: htmlToText(q), answer: htmlToText(a) }
    })
    .filter((f) => f.question && f.answer)
}

// Where to place the in-article invitation: before the section heading nearest the middle of the piece,
// never in the first quarter, never inside or after the FAQ
function splitHtml(html: string): string[] {
  const faqAt = html.search(/<h2 id="[^"]+">[^<]*שאלות נפוצות/)
  const limit = faqAt === -1 ? html.length * 0.85 : faqAt
  const target = html.length * 0.45
  let best = -1
  for (const m of html.matchAll(/<h2 id=/g)) {
    const at = m.index ?? 0
    if (at < html.length * 0.25 || at >= limit) continue
    if (best === -1 || Math.abs(at - target) < Math.abs(best - target)) best = at
  }
  return best === -1 ? [html] : [html.slice(0, best), html.slice(best)]
}

// ─── Portable Text (used when an article has no Word file) ───────────────────

function blockText(block: PtBlock) {
  const children = (block.children as { text?: string }[] | undefined) ?? []
  return children.map((c) => c.text ?? '').join('')
}

function preparePortableText(blocks: PtBlock[]) {
  const toc: TocItem[] = []
  const ptHeadingIds: Record<string, string> = {}
  let words = 0
  let faqStart = -1
  blocks.forEach((b, i) => {
    if (b._type !== 'block') return
    const text = blockText(b)
    words += countWords(text)
    // h1 inside the body is shown as a section heading (one H1 per page)
    if (b.style === 'h2' || b.style === 'h1') {
      const id = `section-${toc.length + 1}`
      toc.push({ id, text: tocText(text) })
      ptHeadingIds[b._key] = id
      if (faqStart === -1 && text.includes('שאלות נפוצות')) faqStart = i
    }
  })

  const faq: PreparedArticle['faq'] = []
  if (faqStart !== -1) {
    for (let i = faqStart + 1; i < blocks.length; i++) {
      const b = blocks[i]
      if (b._type !== 'block') continue
      if (b.style === 'h2' || b.style === 'h1') break
      if (b.style === 'h3') faq.push({ question: blockText(b), answer: '' })
      else if (faq.length) faq[faq.length - 1].answer = `${faq[faq.length - 1].answer} ${blockText(b)}`.trim()
    }
  }

  // Split before the h2 nearest the middle (same rules as the Word version)
  const h2s = blocks.map((b, i) => (b._key in ptHeadingIds ? i : -1)).filter((i) => i > blocks.length * 0.25 && (faqStart === -1 || i < faqStart))
  const target = blocks.length * 0.45
  const cut = h2s.reduce((best, i) => (best === -1 || Math.abs(i - target) < Math.abs(best - target) ? i : best), -1)
  const segments: BodySegment[] =
    cut === -1 ? [{ kind: 'pt', blocks }] : [{ kind: 'pt', blocks: blocks.slice(0, cut) }, { kind: 'pt', blocks: blocks.slice(cut) }]

  return { segments, toc, ptHeadingIds, words, faq: faq.filter((f) => f.question && f.answer) }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

export async function prepareArticle(post: BlogPost): Promise<PreparedArticle | null> {
  const docxHtml = post.docxFileUrl ? await parseDocx(post.docxFileUrl) : null
  if (docxHtml) {
    const { html, toc } = shapeHtml(docxHtml)
    const words = countWords(htmlToText(html))
    return {
      segments: splitHtml(html).map((h) => ({ kind: 'html' as const, html: h })),
      toc,
      ptHeadingIds: {},
      words,
      minutes: readingMinutes(words),
      faq: extractFaqFromHtml(html),
    }
  }
  if (post.body?.length) {
    const pt = preparePortableText(post.body)
    return { ...pt, minutes: readingMinutes(pt.words) }
  }
  return null
}

// Reading time for the listing cards (Word files are cached, so this is cheap after the first build)
export async function readingMinutesFor(post: BlogPost): Promise<number | null> {
  if (!post.docxFileUrl) return null
  const html = await parseDocx(post.docxFileUrl)
  return html ? readingMinutes(countWords(htmlToText(shapeHtml(html).html))) : null
}
