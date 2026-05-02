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
import PaintStroke, { type StrokePattern } from '@/components/ui/PaintStroke'

export const metadata: Metadata = {
  title: 'טל רומן — חינוך מיני ואינטימיות',
}

// Container is half the SVG height, negative-margin = same as container height → zero net flow shift.
// overflow:visible lets the SVG bleed into the adjacent section so the next section shows through.

// BottomDivider: sits at the very start of the NEXT section (fully over it).
// margin-bottom = -height → next section starts at the same Y, divider is on top of it.
// The solid fill (= current section's color) overlaps the next section's top.
// Below the wavy edge is transparent → next section shows through.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function TopDivider({ stroke }: { stroke: any }) {
  if (!stroke?.topEnabled || !stroke.topPattern || !stroke.topColor) return null
  return (
    <div className="h-20 -mt-20 relative z-10" style={{ lineHeight: 0 }}>
      <PaintStroke pattern={stroke.topPattern as StrokePattern} color={stroke.topColor} flipped />
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BottomDivider({ stroke }: { stroke: any }) {
  if (!stroke?.bottomEnabled || !stroke.bottomPattern || !stroke.bottomColor) return null
  return (
    <div className="h-20 -mb-20 relative z-10" style={{ lineHeight: 0 }}>
      <PaintStroke pattern={stroke.bottomPattern as StrokePattern} color={stroke.bottomColor} />
    </div>
  )
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

      <TopDivider stroke={homepage?.heroStroke} />
      <HeroSection
        headline={homepage?.heroHeadline ?? 'טל רומן'}
        subheadline={homepage?.heroSubheadline ?? 'מגשרת על פערים באינטימיות וביחסים'}
        bodyText={homepage?.heroBodyText ?? 'סדנאות וליווי רגשי לאנשים שמרגישים שמשהו באינטימיות חסר, ורוצים להבין, לשפר, ולהעמיק את החיבור.'}
        heroImage={homepage?.heroImage ?? null}
        bgImage={homepage?.heroBgImage ?? null}
        ctaText={homepage?.heroCtaText}
      />
      <BottomDivider stroke={homepage?.heroStroke} />

      {homepage?.personalMessage && (
        <>
          <TopDivider stroke={homepage?.personalMessageStroke} />
          <PersonalMessage message={homepage.personalMessage} bgImage={homepage?.personalMessageBgImage ?? null} />
          <BottomDivider stroke={homepage?.personalMessageStroke} />
        </>
      )}

      <TopDivider stroke={homepage?.giftsStroke} />
      <FunnelSection gifts={gifts} />
      <BottomDivider stroke={homepage?.giftsStroke} />

      <TopDivider stroke={homepage?.testimonialsStroke} />
      <RecommendersSection testimonials={allTestimonials} bgImage={homepage?.testimonialsBgImage ?? null} />
      <BottomDivider stroke={homepage?.testimonialsStroke} />

      {homepage?.featuredCourses?.length > 0 && (
        <>
          <TopDivider stroke={homepage?.coursesStroke} />
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
          <BottomDivider stroke={homepage?.coursesStroke} />
        </>
      )}

      <MediaMentionsSection mentions={mediaMentions} />

      {(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage) && (
        <>
          <TopDivider stroke={homepage?.aboutStroke} />
          <AboutSection
            aboutImage={homepage?.aboutImage ?? null}
            aboutBio={homepage?.aboutBio ?? ''}
            aboutQuote={homepage?.aboutQuote ?? ''}
            bgImage={homepage?.aboutBgImage ?? null}
          />
          <BottomDivider stroke={homepage?.aboutStroke} />
        </>
      )}

      <TopDivider stroke={homepage?.contactStroke} />
      <section id="contact" className="py-20 bg-cream relative overflow-hidden">
        <SectionBackground image={homepage?.contactBgImage ?? null} />
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">צרו איתי קשר</h2>
            <p className="text-charcoal text-lg">אשמח לשמוע ממכם ואחזור אליכם בהקדם</p>
            <div className="w-16 h-1 bg-gold/50 mx-auto mt-4 rounded-full" />
          </div>
          <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-xl shadow-gold/10 p-8">
            <ContactForm
              tag={settings?.contactFormTag}
              status={settings?.contactFormStatus}
            />
          </div>
        </div>
      </section>
      <BottomDivider stroke={homepage?.contactStroke} />
    </>
  )
}
