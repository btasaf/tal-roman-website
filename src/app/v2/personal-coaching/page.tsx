import type { Metadata } from 'next'
import CoachingV2 from '@/components/v2/coaching/CoachingV2'
import { FAQ, HERO, PRICING } from '@/components/v2/coaching/coaching-content'
import { BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd'
import { fetchCoachingTestimonials } from '@/lib/queries'

const URL = 'https://www.talroman.com/personal-coaching'
const TITLE = 'ליווי אישי — טל רומן'
const DESCRIPTION = 'ליווי רגשי אישי ומקצועי בנושא מיניות, אינטימיות ויחסים — תהליך מעמיק עם טל רומן במרחב בטוח ולא שיפוטי.'

// Same values as the live page; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

// Service + offer, from the facts on the page (price per one-hour session, clinic in south Tel Aviv or Zoom)
const serviceJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: HERO.title,
  description: HERO.subtitle,
  url: URL,
  inLanguage: 'he',
  serviceType: 'ליווי רגשי אישי בנושא מיניות, אינטימיות ויחסים',
  provider: { '@type': 'Person', name: 'טל רומן', url: 'https://www.talroman.com' },
  areaServed: { '@type': 'Country', name: 'Israel' },
  availableChannel: [
    { '@type': 'ServiceChannel', name: 'קליניקה בדרום תל אביב' },
    { '@type': 'ServiceChannel', name: 'זום' },
  ],
  offers: {
    '@type': 'Offer',
    price: PRICING.price,
    priceCurrency: 'ILS',
    description: PRICING.unit,
    url: URL,
  },
}

export default async function PersonalCoachingV2Page() {
  // Only testimonials about private one-on-one coaching (never courses, workshops, lectures or communities)
  const testimonials = await fetchCoachingTestimonials().catch(() => [])

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <BreadcrumbJsonLd
        items={[
          { name: 'טל רומן', url: 'https://www.talroman.com' },
          { name: 'ליווי אישי', url: URL },
        ]}
      />
      <FaqJsonLd items={FAQ.map((f) => ({ question: f.q, answer: f.a }))} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <CoachingV2 testimonials={testimonials} />
    </>
  )
}
