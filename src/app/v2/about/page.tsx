import type { Metadata } from 'next'
import { fetchAllTestimonials, fetchHomepageSection, fetchSiteSettings } from '@/lib/queries'
import { siteStats } from '@/components/v2/site-stats'
import AboutHero from '@/components/v2/about/AboutHero'
import AboutStory from '@/components/v2/about/AboutStory'
import AboutNumbers from '@/components/v2/about/AboutNumbers'
import AboutCredentials from '@/components/v2/about/AboutCredentials'
import AboutVoices from '@/components/v2/about/AboutVoices'
import AboutClosing from '@/components/v2/about/AboutClosing'
import { parseBio, parseCredentials, pickVoices } from '@/components/v2/about/about-content'

const TITLE = 'קצת עליי — טל רומן'
const DESCRIPTION = 'טל רומן — מנחה, מרצה ומלווה כבר מעל 10 שנים בתחומי היחסים והמיניות הבריאה. הגישה, הדרך, הרקע וההכשרות.'

// v2 stays out of the index until it replaces the live pages
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.talroman.com/about' },
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: 'https://www.talroman.com/about', locale: 'he_IL', type: 'profile', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function AboutV2Page() {
  const [homepage, testimonials, settings] = await Promise.all([
    fetchHomepageSection().catch(() => null),
    fetchAllTestimonials().catch(() => []),
    fetchSiteSettings().catch(() => null),
  ])

  const { lead, belief, story } = parseBio(homepage?.aboutBio)
  const { role, list } = parseCredentials(homepage?.aboutQuote)
  const voices = pickVoices(testimonials ?? [])

  return (
    <>
      {/* Same overrides as the v2 homepage: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <div>
        <AboutHero lead={lead} belief={belief} />
        <AboutStory paragraphs={story} />
        <AboutNumbers role={role} stats={siteStats(settings)} />
        <AboutCredentials items={list} />
        <AboutVoices voices={voices} />
        <AboutClosing />
      </div>
    </>
  )
}
