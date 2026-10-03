import { urlFor } from '@/sanity/client'
import type { Course } from '@/lib/types'
import { artFor } from './course-data'

// Server-side: the art-directed course image as a plain URL (uncropped beyond the rect, so the frame can
// crop it with object-fit at any aspect ratio). Client sections receive only the string.
export type CourseImage = { src: string; focus: string } | null

export function courseImage(course: Pick<Course, 'slug' | 'primaryImage' | 'thumbnail'>, width = 1200): CourseImage {
  const { image, rect, focus } = artFor(course)
  if (!image) return null
  let b = urlFor(image)
  if (rect) b = b.rect(...rect)
  return { src: b.width(width).quality(82).auto('format').url(), focus }
}
