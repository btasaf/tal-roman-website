import { urlFor } from '@/sanity/client'
import type { MediaMention } from '@/lib/types'

// Data for /v2/media, built on the server (plain strings go to the client). Client components import only
// the types from this file. Every active media mention from Sanity, in the Sanity order; nothing is added.

export type MediaKind = 'video' | 'article' | 'podcast'

export interface MediaImage {
  src: string
  contain?: boolean // artwork kept whole (podcast covers)
  bg?: string
}

export interface MediaItem {
  id: string
  title: string
  dek?: string // the line under the headline (the CMS upper title / excerpt)
  outlet: string
  kind: MediaKind
  url: string
  image: MediaImage | null // null: shown as a type-only clipping (no photo)
  embed?: { provider: 'spotify' | 'youtube'; src: string }
}

export const KIND_LABEL: Record<MediaKind, string> = { video: 'וידאו', article: 'כתבה', podcast: 'פודקאסט' }
export const ACTION_LABEL: Record<MediaKind, string> = { video: 'לצפייה', article: 'לקריאה', podcast: 'להאזנה' }

// Publication name: the verified CMS logo alt text ("הלוגו של 102 FM" -> "102 FM"), then the source key,
// then the link's own site name
const SOURCE_NAMES: Record<string, string> = { ynet: 'ynet', mako: 'mako', walla: 'וואלה', channel12: 'ערוץ 12', sexapil: 'סקסאפיל', et: 'מגזין את' }
const TIDY: Record<string, string> = { 'Y NET': 'ynet', MAKO: 'mako', 'ספוטיפי': 'Spotify' }
const HOSTS: Record<string, string> = { 'open.spotify.com': 'Spotify', 'youtube.com': 'YouTube', 'chicklist.co.il': 'chicklist' }

function outletOf(m: MediaMention): string {
  const fromAlt = m.logoAlt?.replace(/^(ה?לוגו של)\s*/, '').trim()
  if (fromAlt && !/^(פודקאסט|CHECKLIST)$/i.test(fromAlt)) return TIDY[fromAlt] ?? fromAlt
  if (SOURCE_NAMES[m.source]) return SOURCE_NAMES[m.source]
  try {
    const host = new URL(m.externalUrl).hostname.replace(/^www\./, '')
    return HOSTS[host] ?? host
  } catch {
    return ''
  }
}

// The CMS line often ends just before the outlet's name ("כתבה על תקשורת מינית באתר"): complete it
function dekOf(m: MediaMention, outlet: string): string | undefined {
  const line = (m.upperTitle || m.excerpt || '').replace(/\s+/g, ' ').trim()
  if (!line || normal(line) === normal(m.title)) return undefined
  return /(באתר|בערוץ|בבלוג|ברשת|של)$/.test(line) && outlet ? `${line} ${outlet}` : line
}

const normal = (s: string) => s.replace(/[–—-]/g, '-').replace(/["״]/g, '').replace(/\s+/g, ' ').trim()

// Thumbnails that are intimate photos (bed, bare skin, lingerie): their clippings are set in type only, so the
// page reads as a professional press room. Keys are the image asset ids.
const TYPE_ONLY = new Set([
  'f6e58089f28ac6c42b359176ab2f8c24fb2ae6ee', // mako "שיעור בתקשורת"
  '7f7eec2ec1291e214b6ac15827f8cd2a3cbb927f', // את "להכניס את הטנטרה למיטה"
  '62ec736ec70485ad36c0d8af767b2cdf860fcf82', // mako "זה הכל בשבילך"
  'ea118d6f08482ad9b34be557bacbf833d03dbdb9', // ynet "יחסים"
  'f9ddd6f709bd3ba20d2c1fd31aad3508d1ebab32', // ynet "גברים ונשים זקוקים לריפוי"
  '0f5f8d5872f4717c91c9cab90f8b06ea1247ab17', // את "פחות מעשים יותר דיבורים"
  'eaa056bdc19d02babe83080022dcc6da0acf9bba', // וואלה "מולטי אורגזמה לגברים"
  'dfdf831da220a27d43738725eaddb2ec5b3ac435', // את "תרגול פשוט להעלאת החשק המיני"
])

// Per-image framing for screenshots of article pages: the photo inside them (cx/cy focal point, w crop width,
// as fractions of the original). 'contain' keeps artwork whole (area = l, t, w, h fractions).
type Framing = { cx: number; cy: number; w: number } | { contain: true; bg: string; area: [number, number, number, number] }
const FRAMING: Record<string, Framing> = {
  f11183e35c23620a13eaf0388546f7fa9e2881b8: { cx: 0.38, cy: 0.75, w: 0.62 }, // N12 NEXT: the video still
  '14070612b1530a475dddbc92ed3a6834e4d74502': { contain: true, bg: '#5d43a3', area: [0.1, 0.04, 0.765, 0.915] }, // 102FM cover
  ea0a2133cc7f47abba16aaa376a945491e7a4db2: { cx: 0.5, cy: 0.77, w: 0.5 }, // ynet "שניים לעונג": the video still
  '2d116a82860f9549e59a51073f867ec94b044a03': { cx: 0.5, cy: 0.74, w: 0.72 }, // ynet workshop photo
  '4645f2eeec44b690ec916cd6e7eb9dc73591a0cf': { cx: 0.5, cy: 0.72, w: 0.72 }, // chicklist retreat photo
  '1f1069602a2d587679da8e1323390836ec6fcf07': { cx: 0.5, cy: 0.52, w: 0.86 }, // podcast video still
}
const RATIO = 4 / 3

function imageOf(m: MediaMention): MediaImage | null {
  const ref = (m.thumbnail as { asset?: { _ref?: string } } | null | undefined)?.asset?._ref
  if (!ref) return null
  const match = ref.match(/^image-([a-f0-9]+)-(\d+)x(\d+)-/)
  if (!match) return { src: urlFor(m.thumbnail).width(800).height(600).auto('format').url() }
  const [, id, ws, hs] = match
  if (TYPE_ONLY.has(id)) return null
  const W = +ws
  const H = +hs
  const f = FRAMING[id]
  if (f && 'contain' in f) {
    const [l, t, w, h] = f.area
    return {
      src: urlFor(m.thumbnail).rect(Math.round(l * W), Math.round(t * H), Math.round(w * W), Math.round(h * H)).width(720).auto('format').url(),
      contain: true,
      bg: f.bg,
    }
  }
  if (f) {
    const w = Math.round(f.w * W)
    const h = Math.min(H, Math.round(w / RATIO))
    const left = Math.max(0, Math.min(W - w, Math.round(f.cx * W - w / 2)))
    const top = Math.max(0, Math.min(H - h, Math.round(f.cy * H - h / 2)))
    return { src: urlFor(m.thumbnail).rect(left, top, w, h).width(800).height(600).auto('format').url() }
  }
  return { src: urlFor(m.thumbnail).width(800).height(600).auto('format').url() }
}

// Inline players for links that offer an embeddable player (loaded only when the visitor presses play)
function embedOf(url: string): MediaItem['embed'] {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, '')
    const spotify = host === 'open.spotify.com' && u.pathname.match(/^\/episode\/([A-Za-z0-9]+)/)
    if (spotify) return { provider: 'spotify', src: `https://open.spotify.com/embed/episode/${spotify[1]}?utm_source=generator&theme=0` }
    const yt = host === 'youtube.com' && u.searchParams.get('v')
    if (yt && /^[\w-]{6,}$/.test(yt)) return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0` }
  } catch {
    // not a URL: link only
  }
  return undefined
}

// The same story entered twice (same link, same headline up to punctuation) is shown once
export function buildMedia(mentions: MediaMention[]): MediaItem[] {
  const seen = new Set<string>()
  const out: MediaItem[] = []
  mentions.forEach((m, i) => {
    if (!m?.externalUrl || !m.title) return
    const key = `${m.externalUrl}|${normal(m.title)}`
    const dupOf = [...seen].find((k) => {
      const [u, t] = k.split('|')
      return u === m.externalUrl && (t.includes(normal(m.title)) || normal(m.title).includes(t))
    })
    if (dupOf) return
    seen.add(key)
    const outlet = outletOf(m)
    const kind: MediaKind = m.mediaType === 'video' || m.mediaType === 'podcast' ? m.mediaType : m.mediaType === 'interview' ? 'video' : 'article'
    out.push({
      id: `m${i}`,
      title: m.title.trim(),
      dek: dekOf(m, outlet),
      outlet,
      kind,
      url: m.externalUrl,
      image: imageOf(m),
      embed: kind === 'article' ? undefined : embedOf(m.externalUrl),
    })
  })
  return out
}

export function outletsOf(items: MediaItem[]) {
  return [...new Set(items.map((i) => i.outlet).filter(Boolean))]
}
