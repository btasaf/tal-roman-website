import type { Metadata } from 'next'
import {
  fetchHomepageSection,
  fetchAllTestimonials,
  fetchGifts,
  fetchSiteSettings,
  fetchMediaMentions,
} from '@/lib/queries'
import type { Course } from '@/lib/types'
import { PersonJsonLd } from '@/components/JsonLd'
import HeroSection from '@/components/HeroSection'
import PersonalMessage from '@/components/PersonalMessage'
import FunnelSection from '@/components/FunnelSection'
import AboutSection from '@/components/AboutSection'
import CourseCard from '@/components/CourseCard'
import MediaMentionsSection from '@/components/MediaMentionsSection'
import RecommendersSection from '@/components/RecommendersSection'
import ContactForm from '@/components/ContactForm'
import SectionDivider from '@/components/ui/SectionDivider'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionBackground from '@/components/ui/SectionBackground'

export const metadata: Metadata = {
  title: 'טל רומן — חינוך מיני ואינטימיות',
}

export default async function HomePage() {
  const [homepage, allTestimonials, gifts, settings, mediaMentions] = await Promise.all([
    fetchHomepageSection().catch(() => null),
    fetchAllTestimonials().catch(() => []),
    fetchGifts().catch(() => []),
    fetchSiteSettings().catch(() => null),
    fetchMediaMentions().catch(() => []),
  ])

  return (
    <>
      <PersonJsonLd />

      <HeroSection
        headline={homepage?.heroHeadline ?? 'טל רומן'}
        subheadline={homepage?.heroSubheadline ?? 'מגשרת על פערים באינטימיות וביחסים'}
        bodyText={homepage?.heroBodyText ?? 'סדנאות וליווי רגשי לאנשים שמרגישים שמשהו באינטימיות חסר, ורוצים להבין, לשפר, ולהעמיק את החיבור.'}
        heroImage={homepage?.heroImage ?? null}
        bgImage={homepage?.heroBgImage ?? null}
        ctaText={homepage?.heroCtaText}
      />

      {homepage?.personalMessage && (
        <PersonalMessage message={homepage.personalMessage} bgImage={homepage?.personalMessageBgImage ?? null} />
      )}

      <FunnelSection gifts={gifts} />

      {(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage) && (
        <AboutSection
          aboutImage={homepage?.aboutImage ?? null}
          aboutBio={homepage?.aboutBio ?? ''}
          aboutQuote={homepage?.aboutQuote ?? ''}
          bgImage={homepage?.aboutBgImage ?? null}
        />
      )}

      <RecommendersSection testimonials={allTestimonials.slice(0, 6)} bgImage={homepage?.testimonialsBgImage ?? null} />

      {homepage?.featuredCourses?.length > 0 && (
        <section className="relative overflow-hidden py-20 bg-gold/25">
          <SectionBackground image={homepage?.coursesBgImage ?? null} />
          <div className="relative max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {homepage.coursesHeadline ?? 'בואו להעשיר את עצמכם ביחד איתי'}
              </h2>
              <SectionDivider />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepage.featuredCourses.map((course: Course, i: number) => (
                <CourseCard key={course.slug} {...course} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="/courses"
                className="inline-block border-2 border-brand text-brand font-semibold px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-colors"
              >
                כל הקורסים
              </a>
            </div>
          </div>
        </section>
      )}

      <MediaMentionsSection mentions={mediaMentions} />

      <section id="contact" className="py-20 bg-dusk relative overflow-hidden">
        <SectionBackground image={homepage?.contactBgImage ?? null} />
        <BokehBackground />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-3">צרי איתי קשר</h2>
            <p className="text-sand text-lg">אשמח לשמוע ממך ואחזור אליך בהקדם</p>
            <div className="w-16 h-1 bg-gold/50 mx-auto mt-4 rounded-full" />
          </div>
          <ContactForm
            tag={settings?.contactFormTag}
            status={settings?.contactFormStatus}
          />
        </div>
      </section>
    </>
  )
}
