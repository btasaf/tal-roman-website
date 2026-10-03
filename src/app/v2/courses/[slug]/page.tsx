import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAllTestimonials, fetchCourseBySlug, fetchCourses, fetchTestimonials } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import type { Course } from '@/lib/types'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd'
import CourseV2 from '@/components/v2/courses/CourseV2'
import { SITE, parsePrice, plainTitle, priceNumber } from '@/components/v2/courses/course-data'
import { toCourseView } from '@/components/v2/courses/course-view'

interface Props {
  params: Promise<{ slug: string }>
}

// Same slugs as the live /courses/[slug] route: unknown slugs 404
export const dynamicParams = false

export async function generateStaticParams() {
  const courses: Course[] = await fetchCourses().catch(() => [])
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug).catch(() => null)
  if (!course) return { title: { absolute: 'קורס לא נמצא | טל רומן' }, robots: { index: false, follow: true } }

  const url = `${SITE}/courses/${slug}`
  // Same title as the live page renders (its title + the site template), without doubling the name
  const title = `${course.seoTitle ?? plainTitle(course.title)} | טל רומן`
  const description = course.seoDescription ?? course.shortDescription
  const source = course.primaryImage ?? course.thumbnail
  const image = source ? urlFor(source).width(1200).height(630).fit('crop').url() : '/og-image.jpg'

  // v2 stays out of the index until it replaces the live page
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: { title, description, type: 'website', url, locale: 'he_IL', images: [{ url: image, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  }
}

export default async function CourseV2Page({ params }: Props) {
  const { slug } = await params
  const [course, all, featured] = await Promise.all([
    fetchCourseBySlug(slug).catch(() => null),
    fetchAllTestimonials().catch(() => []),
    fetchTestimonials().catch(() => []),
  ])
  if (!course) notFound()

  const view = toCourseView(course, all, featured)
  const url = `${SITE}/courses/${slug}`
  const name = plainTitle(course.title)

  // Course + its real offers (one per price line in Sanity), mode from the course type
  const offers = parsePrice(course.price)
    .filter((p) => priceNumber(p.now) != null)
    .map((p) => ({
      '@type': 'Offer',
      price: priceNumber(p.now),
      priceCurrency: 'ILS',
      category: 'Paid',
      description: p.raw,
      ...(view.ctaUrl ? { url: view.ctaUrl } : {}),
    }))
  const courseJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name,
    description: course.seoDescription ?? course.shortDescription ?? name,
    url,
    inLanguage: 'he',
    provider: { '@type': 'Person', name: 'טל רומן', url: SITE },
    ...(offers.length ? { offers: offers.length === 1 ? offers[0] : offers } : {}),
    ...(course.type === 'digital' || course.type === 'workshop'
      ? {
          hasCourseInstance: {
            '@type': 'CourseInstance',
            courseMode: course.type === 'digital' ? 'Online' : 'Onsite',
            ...(course.type === 'workshop' ? { location: { '@type': 'Place', name: 'תל אביב', address: { '@type': 'PostalAddress', addressLocality: 'תל אביב', addressCountry: 'IL' } } } : {}),
          },
        }
      : {}),
  }

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }} />
      <BreadcrumbJsonLd
        items={[
          { name: 'דף הבית', url: SITE },
          { name: 'קורסים', url: `${SITE}/courses` },
          { name, url },
        ]}
      />
      {view.faq.length > 0 && <FaqJsonLd items={view.faq} />}
      <CourseV2 course={view} />
    </>
  )
}
