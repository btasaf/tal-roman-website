import type { Metadata } from 'next'
import { fetchAllTestimonials, fetchHomepageSection, fetchMediaMentions, fetchSiteSettings } from '@/lib/queries'
import HeroV2 from '@/components/v2/HeroV2'
import MediaSection from '@/components/v2/MediaSection'
import MessageStory from '@/components/v2/MessageStory'
import Recommendations from '@/components/v2/Recommendations'
import AboutV2 from '@/components/v2/AboutV2'
import { siteStats } from '@/components/v2/site-stats'
import ContactV2 from '@/components/v2/ContactV2'
import { PersonJsonLd, WebsiteJsonLd } from '@/components/JsonLd'

const TITLE = 'טל רומן — חינוך מיני ואינטימיות'
const DESCRIPTION = 'קורסים, סדנאות וליווי אישי בנושא מיניות ואינטימיות לזוגות ויחידים.'

// Same values as the live homepage; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.talroman.com' },
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.talroman.com',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: ['/og-image.jpg'],
  },
}

export default async function V2Page() {
  const [homepage, testimonials, mediaMentions, settings] = await Promise.all([
    fetchHomepageSection().catch(() => null),
    fetchAllTestimonials().catch(() => []),
    fetchMediaMentions().catch(() => []),
    fetchSiteSettings().catch(() => null),
  ])

  return (
    <>
      {/* Remove pt-20 padding from main, hide WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>

      <PersonJsonLd />
      <WebsiteJsonLd />

      <div>
      {/* 1. HERO - Image moves aside, text appears progressively with scroll */}
      <HeroV2
        heroImage={homepage?.heroImage ?? null}
        heroHeadline={homepage?.heroHeadline}
        heroSubheadline={homepage?.heroSubheadline}
      />

      {/* 2. DIAGONAL REVEAL + HORIZONTAL CARDS - One unified sticky section */}
      <MediaSection mediaMentions={mediaMentions.slice(0, 5)} videoUrl={homepage?.mediaBackgroundVideo} />

      {/* 3. MESSAGE - Pinned story: one message at a time, each fades in and out */}
      {/* Story + testimonials share one pinned background (one continuous space) */}
      <MessageStory message={homepage?.personalMessage}>

      {/* Rest follows the old homepage order (media already covered above) */}
      {/* 4. TESTIMONIALS - two drifting rows */}
        <Recommendations testimonials={testimonials} />
      </MessageStory>

      {/* Courses section removed for now (component kept in src/components/v2/CoursesV2.tsx) */}

      {/* 6. ABOUT */}
      {(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage) && (
        <AboutV2
          aboutImage={homepage?.aboutImage ?? null}
          aboutBio={homepage?.aboutBio ?? ''}
          aboutQuote={homepage?.aboutQuote ?? ''}
          stats={siteStats(settings)}
        />
      )}

      {/* 7. CONTACT */}
      <ContactV2
        tag={settings?.contactFormTag}
        status={settings?.contactFormStatus}
        whatsapp={settings?.whatsapp}
        afterAbout={Boolean(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage)}
      />
    </div>
    </>
  )
}
