import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchAllTestimonials, fetchCourses } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import type { Testimonial, Course } from '@/lib/types'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import RecommenderCard from '@/components/RecommenderCard'

export const metadata: Metadata = { title: 'המלצות' }

const COURSE_GROUPS = [
  { courseTitle: 'מה נשים רוצות במיטה', label: 'מה נשים רוצות במיטה' },
  { courseTitle: 'סדנת טנטרה זוגית', label: 'סדנה פרטית טנטרה לזוגות' },
]

export default async function RecommendationsPage() {
  const [allTestimonials, courses] = await Promise.all([
    fetchAllTestimonials().catch(() => [] as Testimonial[]),
    fetchCourses().catch(() => [] as Course[]),
  ])

  const imageTestimonials = allTestimonials.filter((t: Testimonial) => t.image)

  function getGroupTestimonials(courseTitle: string) {
    return allTestimonials
      .filter((t: Testimonial) =>
        t.courseTitle &&
        (t.courseTitle.includes(courseTitle) || courseTitle.includes(t.courseTitle))
      )
      .slice(0, 4)
  }

  function findCourse(courseTitle: string): Course | undefined {
    return courses.find((c: Course) =>
      c.title.includes(courseTitle) || courseTitle.includes(c.title)
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero header */}
      <section className="relative py-32 bg-dusk text-white overflow-hidden text-center">
        <BokehBackground />
        <div className="relative max-w-3xl mx-auto px-6">
          <p className="text-gold/70 text-sm font-semibold uppercase tracking-widest mb-4">
            מה אומרים עלי
          </p>
          <h1 className="text-6xl md:text-8xl font-extrabold text-gold leading-tight mb-6">
            המלצות
          </h1>
          <p className="text-sand text-xl md:text-2xl leading-relaxed">
            חוויות אמיתיות של נשים שהשתתפו בסדנאות ובקורסים
          </p>
          <div className="mt-8">
            <SectionDivider />
          </div>
        </div>
      </section>

      {/* Image carousel */}
      {imageTestimonials.length > 0 && (
        <section className="py-12 bg-night overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 mb-6">
            <h2 className="text-xl font-bold text-gold text-right">גלריית תמונות</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 pb-4">
            {imageTestimonials.map((t: Testimonial, i: number) => {
              const imgUrl = urlFor(t.image as object).width(320).height(420).url()
              return (
                <div
                  key={i}
                  className="flex-none w-52 snap-start rounded-2xl overflow-hidden border border-gold/20 shadow-lg"
                >
                  <div className="relative w-52 h-64">
                    <Image
                      src={imgUrl}
                      alt={t.name}
                      fill
                      className="object-cover object-top"
                      sizes="208px"
                    />
                  </div>
                  <div className="bg-dusk px-3 py-2 text-right">
                    <p className="text-gold text-xs font-semibold truncate">{t.name}</p>
                    {t.courseTitle && (
                      <p className="text-white/50 text-xs truncate">{t.courseTitle}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Course groups */}
      <div>
        {COURSE_GROUPS.map((group, gi) => {
          const groupItems = getGroupTestimonials(group.courseTitle)
          const course = findCourse(group.courseTitle)

          return (
            <section
              key={gi}
              className={`py-16 ${gi % 2 === 0 ? 'bg-cream' : 'bg-white'}`}
            >
              <div className="max-w-6xl mx-auto px-6">
                <div className="text-right mb-10">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">
                    {group.label}
                  </h2>
                  <div className="w-16 h-1 bg-gold rounded-full mr-0" />
                </div>

                {groupItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {groupItems.map((t: Testimonial, i: number) => (
                      <RecommenderCard key={i} t={t} index={i} />
                    ))}
                  </div>
                ) : (
                  <p className="text-mist text-right mb-10">המלצות בקרוב...</p>
                )}

                <div className="text-right">
                  {course ? (
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-block bg-brand text-white font-bold px-8 py-4 rounded-full hover:bg-brand-dark transition-colors shadow-md shadow-brand/20"
                    >
                      לפרטי הסדנה — {group.label}
                    </Link>
                  ) : (
                    <Link
                      href="/courses"
                      className="inline-block border-2 border-brand text-brand font-semibold px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-colors"
                    >
                      לכל הקורסים
                    </Link>
                  )}
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
