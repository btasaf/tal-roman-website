import type { Course, Testimonial } from '@/lib/types'
import {
  TYPE_TAGS,
  cleanList,
  courseTestimonials,
  leadPrice,
  parseDetails,
  parsePrice,
  splitItem,
  splitShortDescription,
  stripLeadingSymbols,
  type DetailBlock,
  type PriceLine,
} from './course-data'
import { courseImage, type CourseImage } from './course-images'

// Everything the v2 course page shows, reshaped from the Sanity course on the server
export type CourseView = {
  slug: string
  title: string
  typeTag?: string
  type?: string
  lines: string[]
  chips: string[]
  image: CourseImage
  priceLines: PriceLine[]
  lead: { now?: string; was?: string; from: boolean }
  ctaUrl?: string
  ctaLabel?: string
  hasContactForm: boolean
  details: DetailBlock[]
  description?: Course['description']
  learn: { title?: string; body: string }[]
  who: string[]
  testimonials: Testimonial[]
  location?: string
  cancellationPolicy?: string
  ctaText?: string
  faq: { question: string; answer: string }[]
}

export function toCourseView(course: Course, allTestimonials: Testimonial[], featured: Testimonial[]): CourseView {
  const { lines, chips } = splitShortDescription(course.shortDescription)
  const priceLines = parsePrice(course.price)
  const matched = courseTestimonials(allTestimonials, course)
  const description = (course.description ?? []).filter((b) => {
    // drop empty blocks (the CMS has a few that hold only a line break)
    const children = (b as { children?: { text?: string }[] }).children
    return !children || children.some((c) => c.text?.trim())
  })
  return {
    slug: course.slug,
    title: course.title,
    type: course.type,
    typeTag: course.type ? TYPE_TAGS[course.type] ?? course.type : undefined,
    lines,
    chips,
    image: courseImage(course, 1400),
    priceLines,
    lead: leadPrice(priceLines),
    // Same rules as the live page
    ctaUrl: course.purchaseUrl || course.landingPageUrl || undefined,
    ctaLabel: course.ctaButtonLabel?.trim() || undefined,
    hasContactForm: !course.purchaseUrl,
    details: parseDetails(course.fullDetails),
    description: description.length ? description : undefined,
    learn: cleanList(course.whatYoullLearn).map(splitItem),
    who: cleanList(course.whoIsItFor).map(stripLeadingSymbols),
    // This course's own testimonials; the featured set (what the live page shows) when it has none
    testimonials: matched.length ? matched : featured.filter((t) => t.body?.trim()),
    location: course.location?.trim() || undefined,
    cancellationPolicy: course.cancellationPolicy?.trim() || undefined,
    ctaText: course.ctaText?.trim() || undefined,
    faq: (course.faq ?? []).filter((f) => f?.question?.trim() && f?.answer?.trim()).map((f) => ({ question: f.question.trim(), answer: f.answer.trim() })),
  }
}
