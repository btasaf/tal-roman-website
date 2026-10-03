import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAllTestimonials, fetchPresalePageBySlug, fetchPresalePages } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import type { Testimonial } from '@/lib/types'
import PresaleV2 from '@/components/v2/presale/PresaleV2'

interface Props {
  params: Promise<{ slug: string }>
}

const SITE = 'https://www.talroman.com'

// Same slugs as the live /presale/[slug] route
export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await fetchPresalePages().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await fetchPresalePageBySlug(slug).catch(() => null)
  if (!page) return {}

  const url = `${SITE}/presale/${slug}`
  const title = page.courseTitle ? `${page.courseTitle} — טל רומן` : 'טל רומן'
  const description = clip([page.courseEyebrow, page.courseTitle, ...(page.bodyLines ?? [])].filter(Boolean).join(' '), 155)
  const image = page.backgroundImage ? urlFor(page.backgroundImage).width(1200).height(630).fit('crop').url() : '/og-image.jpg'

  // v2 stays out of the index until it replaces the live page (sales pages reached from a training)
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: { title, description, url, locale: 'he_IL', type: 'website', images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

function clip(text: string, max: number) {
  if (text.length <= max) return text
  return text.slice(0, text.lastIndexOf(' ', max - 1)) + '…'
}

// Testimonials Sanity lists under this course: every word of their course name appears in the page's course
// title (e.g. "מה נשים רוצות במיטה" ↔ "מה נשים באמת רוצות במיטה")
function courseTestimonials(all: Testimonial[], courseTitle?: string) {
  if (!courseTitle) return []
  const words = new Set(courseTitle.split(/\s+/))
  return all.filter((t) => {
    const name = t.courseTitle?.trim()
    return name ? name.split(/\s+/).every((w) => words.has(w)) : false
  })
}

export default async function PresaleV2Page({ params }: Props) {
  const { slug } = await params
  const [page, allTestimonials] = await Promise.all([
    fetchPresalePageBySlug(slug).catch(() => null),
    fetchAllTestimonials().catch(() => [] as Testimonial[]),
  ])
  if (!page) notFound()

  const deviceImageUrl = page.deviceImage ? urlFor(page.deviceImage).width(200).height(200).fit('crop').quality(85).url() : null
  const testimonials = courseTestimonials(allTestimonials, page.courseTitle)

  // Course + offer from the real price and checkout link in Sanity
  const courseJsonLd =
    page.courseTitle && page.priceNew != null
      ? {
          '@context': 'https://schema.org',
          '@type': 'Course',
          name: page.courseTitle,
          description: (page.bodyLines ?? []).join(' ') || page.courseTitle,
          inLanguage: 'he',
          url: `${SITE}/presale/${slug}`,
          provider: { '@type': 'Person', name: 'טל רומן', url: SITE },
          offers: {
            '@type': 'Offer',
            price: page.priceNew,
            priceCurrency: 'ILS',
            availability: 'https://schema.org/InStock',
            category: 'Paid',
            ...(page.ctaButtonLink ? { url: page.ctaButtonLink } : {}),
          },
        }
      : null

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      {courseJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />}
      <PresaleV2 page={page} testimonials={testimonials} deviceImageUrl={deviceImageUrl} />
    </>
  )
}
