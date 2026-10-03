import type { Metadata } from 'next'
import { fetchCourseBySlug, fetchCourses } from '@/lib/queries'
import type { Course } from '@/lib/types'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import CoursesCatalogV2, { type CatalogItem } from '@/components/v2/courses/CoursesCatalogV2'
import { SITE, leadPrice, parsePrice, plainTitle } from '@/components/v2/courses/course-data'
import { courseImage } from '@/components/v2/courses/course-images'

const URL = `${SITE}/courses`
const TITLE = 'קורסים ומוצרים | טל רומן'
const DESCRIPTION = 'קורסים דיגיטליים, סדנאות וליווי אישי בנושא מיניות, זוגיות ואינטימיות — בהנחיית טל רומן.'

// Same values as the live page; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, locale: 'he_IL', type: 'website', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function CoursesV2Page({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams
  // Same list as the live page (active courses in Sanity order, de-duplicated by slug), plus each course's
  // detail record for its price and primary image
  const raw: Course[] = await fetchCourses().catch(() => [])
  const list = raw.filter((c, i, arr) => c?.slug && arr.findIndex((x) => x.slug === c.slug) === i)
  const details = await Promise.all(list.map((c) => fetchCourseBySlug(c.slug).catch(() => null)))

  const courses: CatalogItem[] = list.map((c, i) => {
    const full = { ...c, ...(details[i] ?? {}) }
    const priceLines = parsePrice(full.price)
    return {
      slug: c.slug,
      title: full.title,
      type: full.type,
      shortDescription: full.shortDescription,
      price: leadPrice(priceLines),
      image: courseImage(full, 960),
    }
  })

  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'הקורסים של טל רומן',
    itemListElement: courses.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/courses/${c.slug}`,
      name: plainTitle(c.title),
    })),
  }

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <BreadcrumbJsonLd
        items={[
          { name: 'דף הבית', url: SITE },
          { name: 'קורסים', url: URL },
        ]}
      />
      {courses.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />}
      <CoursesCatalogV2 courses={courses} initialType={type} />
    </>
  )
}
