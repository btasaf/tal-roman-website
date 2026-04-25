import type { Metadata } from 'next'
import {
  fetchHomepageSection,
  fetchTestimonials,
  fetchFreeGifts,
  fetchSiteSettings,
  fetchMediaMentions,
} from '@/lib/queries'
import { PersonJsonLd } from '@/components/JsonLd'
import HeroSection from '@/components/HeroSection'
import PersonalMessage from '@/components/PersonalMessage'
import FreeGiftsSection from '@/components/FreeGiftsSection'
import AboutSection from '@/components/AboutSection'
import FeaturedPromo from '@/components/FeaturedPromo'
import CourseCard from '@/components/CourseCard'
import MediaMentionsSection from '@/components/MediaMentionsSection'
import TestimonialsSection from '@/components/TestimonialsSection'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'טל רומן — חינוך מיני ואינטימיות',
}

export default async function HomePage() {
  const [homepage, testimonials, freeGifts, settings, mediaMentions] = await Promise.all([
    fetchHomepageSection().catch(() => null),
    fetchTestimonials().catch(() => []),
    fetchFreeGifts().catch(() => []),
    fetchSiteSettings().catch(() => null),
    fetchMediaMentions().catch(() => []),
  ])

  return (
    <>
      <PersonJsonLd />

      {/* 1. Hero */}
      <HeroSection
        headline={homepage?.heroHeadline ?? 'טל רומן'}
        subheadline={homepage?.heroSubheadline ?? 'מגשרת על פערים באינטימיות וביחסים'}
        bodyText={homepage?.heroBodyText ?? 'סדנאות וליווי רגשי לאנשים שמרגישים שמשהו באינטימיות חסר, ורוצים להבין, לשפר, ולהעמיק את החיבור.'}
        heroImage={homepage?.heroImage ?? null}
        ctaText={homepage?.heroCtaText}
      />

      {/* 2. Personal message — dark bokeh */}
      {homepage?.personalMessage && (
        <PersonalMessage message={homepage.personalMessage} />
      )}

      {/* 3. Free gifts */}
      <FreeGiftsSection
        gifts={freeGifts}
        headline={homepage?.giftsHeadline}
        subheadline={homepage?.giftsSubheadline}
      />

      {/* 4. About Tal */}
      {(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage) && (
        <AboutSection
          aboutImage={homepage?.aboutImage ?? null}
          aboutBio={homepage?.aboutBio ?? ''}
          aboutQuote={homepage?.aboutQuote ?? ''}
        />
      )}

      {/* 5. Featured promo (TALK ME INTO IT) */}
      {homepage?.featuredPromoTitle && (
        <FeaturedPromo
          title={homepage.featuredPromoTitle}
          body={homepage.featuredPromoBody ?? ''}
          ctaText={homepage.featuredPromoCtaText ?? 'לפרטים נוספים'}
          url={homepage.featuredPromoUrl ?? '#'}
          promoImage={homepage.featuredPromoImage ?? null}
        />
      )}

      {/* 6. Featured courses — gold background */}
      {homepage?.featuredCourses?.length > 0 && (
        <section className="py-20 bg-[#e6c060]/25">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {homepage.coursesHeadline ?? 'בואו להעשיר את עצמכם ביחד איתי'}
              </h2>
              <div className="w-16 h-1 bg-[#e6c060] mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homepage.featuredCourses.map((course: any, i: number) => (
                <CourseCard key={course.slug} {...course} index={i} />
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="/courses"
                className="inline-block border-2 border-[#cd2c2c] text-[#cd2c2c] font-semibold px-8 py-4 rounded-full hover:bg-[#cd2c2c] hover:text-white transition-colors"
              >
                כל הקורסים
              </a>
            </div>
          </div>
        </section>
      )}

      {/* 7. Media mentions */}
      <MediaMentionsSection mentions={mediaMentions} />

      {/* 8. Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. Contact form */}
      <section id="contact" className="py-20 bg-[#1a0f08] relative overflow-hidden">
        {/* bokeh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-[#e6c060]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-[10%] left-[15%] w-80 h-80 bg-[#cd2c2c]/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e6c060] mb-3">צרי איתי קשר</h2>
            <p className="text-[#d4b896] text-lg">אשמח לשמוע ממך ואחזור אליך בהקדם</p>
            <div className="w-16 h-1 bg-[#e6c060]/50 mx-auto mt-4 rounded-full" />
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  )
}
