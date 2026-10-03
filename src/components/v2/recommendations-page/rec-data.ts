import { urlFor } from '@/sanity/client'
import type { Course, Testimonial } from '@/lib/types'
import { courseTestimonials, plainTitle } from '../courses/course-data'

// Data for /v2/recommendations, built on the server (plain strings go to the client, no Sanity client there).
// Client components import only the types from this file.

export interface RecShot {
  src: string // the original message, full
  thumb: string // a small crop of its top, for the card's "receipt"
  w: number
  h: number
}

export interface RecItem {
  id: string
  name: string
  course?: string
  body: string
  shot: RecShot | null
}

export interface RecFilter {
  key: string // the exact course name from Sanity ('' = all)
  label: string
  count: number
  href?: string // where to read more about this course / service
  linkLabel?: string
}

// Asset refs look like image-<hash>-<w>x<h>-<ext>
function shotOf(image: Testimonial['image']): RecShot | null {
  const ref = (image as { asset?: { _ref?: string } } | null | undefined)?.asset?._ref
  if (!ref) return null
  const m = ref.match(/^image-[a-f0-9]+-(\d+)x(\d+)-/)
  const w = m ? +m[1] : 1000
  const h = m ? +m[2] : 1400
  const src = urlFor(image).width(Math.min(w, 1100)).auto('format').url()
  // Top of the message (the part with the words), cropped to a 4:5 card
  const tw = w
  const th = Math.min(h, Math.round((w * 5) / 4))
  const thumb = urlFor(image).rect(0, 0, tw, th).width(240).height(300).auto('format').url()
  return { src, thumb, w: Math.min(w, 1100), h: Math.round((Math.min(w, 1100) * h) / w) }
}

const normal = (s: string) => s.trim().replace(/\s+/g, ' ')

// Every active testimonial, in the Sanity order. Exact repeats (same name and same words) are entered twice in
// the CMS; they're shown once.
export function buildItems(testimonials: Testimonial[]): RecItem[] {
  const seen = new Set<string>()
  const out: RecItem[] = []
  testimonials.forEach((t, i) => {
    const body = t.body?.trim()
    if (!body) return
    const key = `${normal(t.name ?? '')}|${normal(body)}`
    if (seen.has(key)) return
    seen.add(key)
    out.push({ id: `r${i}`, name: t.name?.trim() || 'אנונימי', course: t.courseTitle?.trim() || undefined, body, shot: shotOf(t.image) })
  })
  return out
}

// Filter chips: one per course name with at least 3 voices (the rest stay under "all"), biggest first.
// Each links to the matching course page (same matching as the v2 course pages), or to personal coaching.
export function buildFilters(items: RecItem[], testimonials: Testimonial[], courses: Course[]): RecFilter[] {
  const counts = new Map<string, number>()
  for (const it of items) if (it.course) counts.set(it.course, (counts.get(it.course) ?? 0) + 1)
  const uniqueCourses = courses.filter((c, i, arr) => c?.slug && arr.findIndex((x) => x.slug === c.slug) === i)

  const filters: RecFilter[] = [...counts.entries()]
    .filter(([, n]) => n >= 3)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => {
      if (name === 'ליווי אישי' || name === 'ייעוץ אישי') {
        return { key: name, label: name, count, href: '/v2/personal-coaching', linkLabel: 'לליווי האישי' }
      }
      const sample = testimonials.filter((t) => t.courseTitle?.trim() === name)
      const course = uniqueCourses.find((c) => courseTestimonials(sample, c).length > 0)
      return course
        ? { key: name, label: name, count, href: `/v2/courses/${course.slug}`, linkLabel: `לפרטים על ${plainTitle(course.title)}` }
        : { key: name, label: name, count }
    })

  return [{ key: '', label: 'הכל', count: items.length }, ...filters]
}

// The featured voice: a short, vivid story of change. Falls back to the fullest quote with a screenshot.
const FEATURED_HINT = 'אחרי עשור ביחד'
export function pickFeatured(items: RecItem[]): RecItem | null {
  return (
    items.find((t) => t.body.includes(FEATURED_HINT)) ??
    [...items].filter((t) => t.shot).sort((a, b) => b.body.length - a.body.length)[0] ??
    null
  )
}

// A few messages for the hero's fanned stack (decorative): portrait screenshots with words in view
export function pickHeroShots(items: RecItem[], featured: RecItem | null): RecShot[] {
  const preferred = ['אחרי שנים של כאבים', 'אמאלה איפה היית', 'הפידבקים הנלהבים']
  const chosen: RecShot[] = []
  for (const p of preferred) {
    const it = items.find((t) => t.body.startsWith(p) && t.shot && t.id !== featured?.id)
    if (it?.shot) chosen.push(it.shot)
  }
  for (const it of items) {
    if (chosen.length >= 3) break
    if (it.shot && it.shot.h > it.shot.w && !chosen.includes(it.shot) && it.id !== featured?.id) chosen.push(it.shot)
  }
  return chosen.slice(0, 3)
}
