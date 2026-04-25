import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { fetchCourseBySlug, fetchCourses } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import type { Course } from '@/lib/types'
import { CourseJsonLd } from '@/components/JsonLd'
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
  return { title: course.title, description: course.shortDescription }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course: Course | null = await fetchCourseBySlug(slug).catch(() => null)
  if (!course) notFound()

  const imageUrl = getImageUrl(course.thumbnail, 'banner')

  return (
    <div className="min-h-screen bg-cream">
      <CourseJsonLd title={course.title} description={course.shortDescription} price={course.price} url={`https://talroman.com/courses/${slug}`} />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {imageUrl && (
          <div className="relative w-full h-72 md:h-96 rounded-[24px] overflow-hidden mb-10 shadow-lg">
            <Image src={imageUrl} alt={course.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-ink mb-4">{course.title}</h1>

        {course.shortDescription && (
          <p className="text-xl text-charcoal mb-8 leading-relaxed">{course.shortDescription}</p>
        )}

        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-gold/20">
          {course.price && (
            <div>
              <span className="text-sm text-mist">מחיר</span>
              <p className="text-3xl font-bold text-brand">{course.price}</p>
            </div>
          )}
          {course.purchaseUrl && (
            <CTAButton href={course.purchaseUrl} target="_blank" rel="noopener noreferrer" className="text-lg shadow-md px-10">
              לרכישה
            </CTAButton>
          )}
        </div>

        {course.description && (
          <div className="prose prose-lg max-w-none text-charcoal [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink">
            <PortableText value={course.description} />
          </div>
        )}
      </div>
    </div>
  )
}
