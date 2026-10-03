import type { Metadata } from 'next'
import { fetchAllTestimonials, fetchCourses } from '@/lib/queries'
import type { Course, Testimonial } from '@/lib/types'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import RecommendationsPageV2 from '@/components/v2/recommendations-page/RecommendationsPageV2'
import { buildFilters, buildItems, pickFeatured, pickHeroShots } from '@/components/v2/recommendations-page/rec-data'

const URL = 'https://www.talroman.com/recommendations'
const TITLE = 'המלצות | טל רומן'
const DESCRIPTION = 'מה אומרים משתתפי הקורסים והסדנאות של טל רומן — חוויות אמיתיות מנשים שעברו תהליך של שינוי במיניות ובאינטימיות.'

// Same title and description as the live page; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, locale: 'he_IL', type: 'website', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function RecommendationsV2Page() {
  const [testimonials, courses] = await Promise.all([
    fetchAllTestimonials().catch(() => [] as Testimonial[]),
    fetchCourses().catch(() => [] as Course[]),
  ])

  const items = buildItems(testimonials ?? [])
  const filters = buildFilters(items, testimonials ?? [], courses ?? [])
  const featured = pickFeatured(items)
  const heroShots = pickHeroShots(items, featured)

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <BreadcrumbJsonLd
        items={[
          { name: 'דף הבית', url: 'https://www.talroman.com' },
          { name: 'המלצות', url: URL },
        ]}
      />
      <RecommendationsPageV2 items={items} filters={filters} featured={featured} heroShots={heroShots} />
    </>
  )
}
