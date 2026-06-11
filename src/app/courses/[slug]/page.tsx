import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { fetchCourseBySlug, fetchCourses, fetchTestimonials } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import type { Course } from '@/lib/types'
import { CourseJsonLd, BreadcrumbJsonLd, FaqJsonLd } from '@/components/JsonLd'
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
import BuyCourseButton from '@/components/course/BuyCourseButton'
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
  const imageUrl = getImageUrl(course.primaryImage ?? course.thumbnail, 'detail')
  const canonicalUrl = `https://www.talroman.com/courses/${slug}`
  const title = course.seoTitle ?? `${course.title} — טל רומן`
  const description = course.seoDescription ?? course.shortDescription
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      locale: 'he_IL',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 600 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  }
}

function ContactButton() {
  return (
    <CTAButton href="#contact" variant="gold" className="rounded-full text-base md:text-lg shadow-lg shadow-gold/20 px-6 md:px-10 py-3 md:py-4 w-full sm:w-auto text-center whitespace-normal">
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
        url={`https://www.talroman.com/courses/${slug}`}
      />
      <BreadcrumbJsonLd items={[
        { name: 'דף הבית', url: 'https://www.talroman.com' },
        { name: 'קורסים', url: 'https://www.talroman.com/courses' },
        { name: course.title, url: `https://www.talroman.com/courses/${slug}` },
      ]} />
      {course.faq && course.faq.length > 0 && (
        <FaqJsonLd items={course.faq} />
      )}

      {/* ── HERO ── */}
      <section className="relative py-28 md:py-36 bg-dusk text-white overflow-hidden">
        <BokehBackground />
        {heroImageUrl && (
          <div className="absolute inset-0 opacity-40">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {ctaUrl ? (
              <BuyCourseButton href={ctaUrl} label={course.ctaButtonLabel} slug={slug} />
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
        slug={slug}
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
        slug={slug}
      />

      {/* ── FAQ ── */}
      <CourseFAQSection items={course.faq ?? []} />

      {/* ── FINAL CTA STRIP ── */}
      <section className="py-24 bg-gradient-to-b from-[#f5e8c0] to-[#fdf6ec] text-center relative overflow-hidden">
        <div className="relative max-w-2xl mx-auto px-6">
          <p className="text-ink text-3xl md:text-4xl font-bold leading-relaxed mb-10">
            {course.ctaText || `הצטרפ/י ל${course.title} וצא/י לדרך.`}
          </p>
          {ctaUrl ? (
            <BuyCourseButton href={ctaUrl} label={course.ctaButtonLabel} slug={slug} />
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
