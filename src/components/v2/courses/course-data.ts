import type { Course, Testimonial } from '@/lib/types'

// Server-safe helpers for the v2 courses pages: they only reshape the Sanity text for display
// (no facts are added). Kept free of React so both the pages and the client sections can use them.

export const SITE = 'https://www.talroman.com'
export const SHEKEL = '₪'

// Same section names the live /courses page groups by
export const CATEGORY_LABELS: Record<string, string> = {
  digital: 'קורסים דיגיטליים',
  workshop: 'סדנאות',
  personal: 'ליווי אישי',
}

// Same labels as COURSE_TYPE_LABELS, phrased as a tag on a single course
export const TYPE_TAGS: Record<string, string> = {
  digital: 'קורס דיגיטלי',
  workshop: 'סדנה',
  personal: 'ליווי אישי',
}

// Live CTA wording (BuyCourseButton / the contact jump)
export const DEFAULT_BUY_LABEL = 'לרכישה עכשיו'
export const CONTACT_LABEL = 'אשמח לקבל פרטים נוספים'
export const CONTACT_ID = 'contact'

// ─── Text ────────────────────────────────────────────────────────────────────

// Leading emoji / bullet symbols (the CMS lists start with ✨ 🧠 🩷 ✔️ …); the design draws its own markers
const LEADING_SYMBOLS = /^[\s\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}•·\-–—]+/u

export function stripLeadingSymbols(text: string) {
  return text.replace(LEADING_SYMBOLS, '').trim()
}

export function startsWithSymbol(text: string) {
  return /^\s*\p{Extended_Pictographic}/u.test(text)
}

// "title\nbody" list items: the first line reads as the item's heading
export function splitItem(text: string): { title?: string; body: string } {
  const clean = stripLeadingSymbols(text)
  const nl = clean.indexOf('\n')
  if (nl > 0) {
    // a short first line that isn't a full sentence; other line breaks stay (whitespace-pre-line)
    const title = clean.slice(0, nl).trim()
    const body = clean.slice(nl + 1).trim()
    if (title && body && title.length <= 50 && !/[.!]$/.test(title)) return { title, body }
  }
  return { body: clean }
}

export function cleanList(items?: string[]) {
  return (items ?? []).map((s) => s?.trim()).filter(Boolean) as string[]
}

// Title with one accent run for the serif: the *starred* word, else a Latin run, else the last word
export function splitAccent(title: string): [string, string, string] {
  const star = title.match(/^(.*?)\*(.+?)\*(.*)$/)
  if (star) return [star[1], star[2], star[3]]
  const latin = title.match(/^(.*?)([A-Za-z][A-Za-z' ]*[A-Za-z])(.*)$/)
  if (latin) return [latin[1], latin[2], latin[3]]
  const i = title.trim().lastIndexOf(' ')
  if (i > 0) return [title.slice(0, i + 1), title.slice(i + 1).trim(), '']
  return ['', title, '']
}

export function plainTitle(title: string) {
  return title.replace(/\*/g, '')
}

// Short description → plain lines plus "a | b | c" lines turned into chips
export function splitShortDescription(text?: string): { lines: string[]; chips: string[] } {
  const lines: string[] = []
  const chips: string[] = []
  for (const raw of (text ?? '').split('\n')) {
    const line = raw.trim()
    if (!line) continue
    if (line.includes('|')) chips.push(...line.split('|').map((s) => s.trim()).filter(Boolean))
    else lines.push(line)
  }
  return { lines, chips }
}

// ─── Full details (plain text with line breaks) ─────────────────────────────

export type DetailBlock =
  | { kind: 'lines'; lines: string[] }
  | { kind: 'heading'; text: string }
  | { kind: 'checks'; items: string[] }

const CHECK = /^\s*(✔️|✔|✅|☑️)/u

export function parseDetails(text?: string): DetailBlock[] {
  if (!text?.trim()) return []
  const blocks: DetailBlock[] = []
  let lines: string[] = []
  let checks: string[] = []
  const flushLines = () => {
    if (lines.length) blocks.push({ kind: 'lines', lines })
    lines = []
  }
  const flushChecks = () => {
    if (checks.length) blocks.push({ kind: 'checks', items: checks })
    checks = []
  }
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line) {
      // a blank line inside a checklist doesn't end it
      if (!checks.length) flushLines()
      continue
    }
    if (CHECK.test(line)) {
      flushLines()
      checks.push(stripLeadingSymbols(line))
    } else if (startsWithSymbol(line)) {
      flushLines()
      flushChecks()
      blocks.push({ kind: 'heading', text: stripLeadingSymbols(line) })
    } else {
      flushChecks()
      lines.push(line)
    }
  }
  flushLines()
  flushChecks()
  return blocks
}

// ─── Price ───────────────────────────────────────────────────────────────────

export type PriceLine = { label?: string; now?: string; was?: string; note?: string; raw: string }

const AMOUNT = /(\d[\d,]*(?:\.\d+)?)\s*ש["״]ח/g

// '450 ש"ח במקום 850 ש"ח' → now 450, was 850 · 'עלות ל-3 שעות … 1,450 ש"ח כולל מע"מ' → label, now, note
export function parsePrice(price?: string): PriceLine[] {
  if (!price?.trim()) return []
  return price
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((raw) => {
      const amounts = [...raw.matchAll(AMOUNT)]
      if (!amounts.length) return { raw }
      const first = amounts[0]
      const label = raw.slice(0, first.index).trim() || undefined
      let rest = raw.slice((first.index ?? 0) + first[0].length).trim()
      let was: string | undefined
      const second = amounts[1]
      if (second && /^במקום\s/.test(rest)) {
        was = second[1]
        rest = raw.slice((second.index ?? 0) + second[0].length).trim()
      }
      return { label, now: first[1], was, note: rest || undefined, raw }
    })
}

export function priceNumber(amount?: string) {
  if (!amount) return undefined
  const n = Number(amount.replace(/,/g, ''))
  return Number.isFinite(n) ? n : undefined
}

// The lowest current price (listing + dock); `from` when the course has more than one price
export function leadPrice(lines: PriceLine[]): { now?: string; was?: string; from: boolean } {
  const priced = lines.filter((l) => l.now)
  if (!priced.length) return { from: false }
  const best = priced.reduce((a, b) => ((priceNumber(b.now) ?? Infinity) < (priceNumber(a.now) ?? Infinity) ? b : a))
  return { now: best.now, was: best.was, from: priced.length > 1 }
}

// ─── Images (art direction) ──────────────────────────────────────────────────
// CMS thumbnails are often marketing banners with burned-in text. Per course: which of the two CMS images
// to use and, where needed, the crop (Sanity rect, in source pixels) that keeps just the photograph.

type Art = { source: 'primary' | 'thumbnail'; rect?: [number, number, number, number]; focus?: string }

const ART: Record<string, Art> = {
  'personal-tantra': { source: 'primary', focus: '58% 40%' },
  'two-for-tantra': { source: 'thumbnail', focus: '50% 30%' },
  // Tal's portrait inside the banner (1280×720)
  'talk-me-into-it': { source: 'thumbnail', rect: [98, 132, 344, 476], focus: '50% 25%' },
  'what-woman-wants': { source: 'primary', focus: '50% 40%' },
  // The photo inside its white margins (1920×1080)
  'what-man-wants': { source: 'primary', rect: [198, 34, 1520, 1008], focus: '45% 50%' },
}

export function artFor(course: Pick<Course, 'slug' | 'primaryImage' | 'thumbnail'>) {
  const art = ART[course.slug]
  const preferred = art?.source === 'thumbnail' ? course.thumbnail : course.primaryImage
  const image = preferred ?? course.primaryImage ?? course.thumbnail ?? null
  const exact = !!art && image === preferred
  return { image, rect: exact ? art.rect : undefined, focus: (exact && art.focus) || '50% 45%' }
}

// ─── Testimonials ────────────────────────────────────────────────────────────

// Course names in testimonials that differ from the course title in Sanity
const TESTIMONIAL_ALIASES: Record<string, string> = {
  'סדנת טנטרה זוגית': 'personal-tantra',
  'שניים לטנטרה דיגיטל': 'two-for-tantra',
}

// Testimonials written about this course: an alias, or every word of their course name appears in the title
// (e.g. "מה נשים רוצות במיטה" ↔ "מה נשים *באמת* רוצות במיטה")
export function courseTestimonials(all: Testimonial[], course: Pick<Course, 'slug' | 'title'>) {
  const words = new Set(plainTitle(course.title).split(/\s+/))
  return all.filter((t) => {
    const name = t.courseTitle?.trim()
    if (!name || !t.body?.trim()) return false
    if (TESTIMONIAL_ALIASES[name]) return TESTIMONIAL_ALIASES[name] === course.slug
    return name.split(/\s+/).every((w) => words.has(w))
  })
}

// One warm grade over every CMS photo (mixed palettes, some saturated reds); sections may lift it on hover
export const GRADE = '[filter:sepia(0.3)_saturate(0.8)_brightness(0.98)]'
