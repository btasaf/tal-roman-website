import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { fetchCourseBySlug, fetchCourses, fetchTestimonials } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import type { Course } from '@/lib/types'
import { CourseJsonLd } from '@/components/JsonLd'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import RecommendersSection from '@/components/RecommendersSection'
import ContactForm from '@/components/ContactForm'
import { COURSE_TYPE_LABELS } from '@/lib/constants'
import CourseLearnSection from '@/components/course/CourseLearnSection'
import CourseWhoSection from '@/components/course/CourseWhoSection'
import CoursePricingSection from '@/components/course/CoursePricingSection'
import CourseFAQSection from '@/components/course/CourseFAQSection'
import CourseDetailsSection from '@/components/course/CourseDetailsSection'
import CTAButton from '@/components/ui/CTAButton'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const courses: Course[] = await fetchCourses().catch(() => [])
  return courses.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course: Course | null = await fetchCourseBySlug(slug).catch(() => null)
  if (!course) return { title: 'קורס לא נמצא' }
  return {
    title: `${course.title} — טל רומן`,
    description: course.shortDescription,
    openGraph: { title: course.title, description: course.shortDescription, type: 'website' },
  }
}

function BuyButton({ href, label }: { href: string; label?: string }) {
  return (
    <CTAButton href={href} target="_blank" rel="noopener noreferrer" variant="gold" className="rounded-full text-lg shadow-lg shadow-gold/20 px-10 py-4">
      {label || 'לרכישה עכשיו'}
    </CTAButton>
  )
}

function ContactButton() {
  return (
    <CTAButton href="#contact" variant="gold" className="rounded-full text-lg shadow-lg shadow-gold/20 px-10 py-4">
      אשמח לקבל פרטים נוספים
    </CTAButton>
  )
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const [course, testimonials] = await Promise.all([
    fetchCourseBySlug(slug).catch(() => null),
    fetchTestimonials().catch(() => []),
  ])
  if (!course) notFound()

  const heroImageUrl = getImageUrl(course.primaryImage ?? course.thumbnail, 'banner')
  const ctaUrl = course.purchaseUrl || course.landingPageUrl
  const hasContactForm = !course.purchaseUrl

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <CourseJsonLd
        title={course.title}
        description={course.shortDescription}
        price={course.price}
        url={`https://talroman.com/courses/${slug}`}
      />

      {/* ── HERO ── */}
      <section className="relative py-28 md:py-36 bg-dusk text-white overflow-hidden">
        <BokehBackground />
        {heroImageUrl && (
          <div className="absolute inset-0 opacity-10">
            <Image src={heroImageUrl} alt={course.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gold leading-tight mb-6">
            {course.title}
          </h1>
          {course.shortDescription && (
            <p className="text-sand text-xl md:text-2xl leading-relaxed mb-10 max-w-2xl mx-auto">
              {course.shortDescription}
            </p>
          )}
          {course.price && (
            <p className="text-5xl font-extrabold text-gold mb-8 font-garamond">{course.price}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {ctaUrl ? (
              <BuyButton href={ctaUrl} label={course.ctaButtonLabel} />
            ) : (
              <ContactButton />
            )}
          </div>
          <div className="mt-12">
            <SectionDivider />
          </div>
        </div>
      </section>


      {/* ── FULL DETAILS ── */}
      <CourseDetailsSection
        fullDetails={course.fullDetails}
        description={course.description}
        ctaUrl={ctaUrl}
        ctaButtonLabel={course.ctaButtonLabel}
      />

      {/* ── WHAT YOU'LL LEARN ── */}
      <CourseLearnSection items={course.whatYoullLearn ?? []} />

      {/* ── WHO IS IT FOR ── */}
      <CourseWhoSection items={course.whoIsItFor ?? []} />

      {/* ── TESTIMONIALS ── */}
      {testimonials.length > 0 && (
        <RecommendersSection testimonials={testimonials} dark />
      )}

      {/* ── PRICING ── */}
      <CoursePricingSection
        price={course.price}
        location={course.location}
        cancellationPolicy={course.cancellationPolicy}
        ctaText={course.ctaText}
        ctaUrl={ctaUrl}
        ctaButtonLabel={course.ctaButtonLabel}
      />

      {/* ── FAQ ── */}
      <CourseFAQSection items={course.faq ?? []} />

      {/* ── FINAL CTA STRIP ── */}
      <section className="py-24 bg-gradient-to-br from-dusk to-night text-white text-center relative overflow-hidden">
        <BokehBackground />
        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-sand/90 text-3xl md:text-4xl font-bold leading-relaxed mb-10">
            {course.ctaText || `הצטרפ/י ל${course.title} וצא/י לדרך.`}
          </p>
          {ctaUrl ? (
            <BuyButton href={ctaUrl} label={course.ctaButtonLabel} />
          ) : (
            <ContactButton />
          )}
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      {hasContactForm && (
        <section id="contact" className="py-24 bg-cream">
          <div className="max-w-xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-sienna text-xs font-bold uppercase tracking-[0.25em] mb-3">צור קשר</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-3">השאירי פרטים</h2>
              <p className="text-charcoal text-base">ואחזור אליך בהקדם לתיאום שיחת היכרות</p>
              <div className="mt-6"><SectionDivider /></div>
            </div>
            <ContactForm tag={course.slug} status="קר" />
          </div>
        </section>
      )}
    </div>
  )
}
