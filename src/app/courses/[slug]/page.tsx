import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { fetchCourseBySlug, fetchCourses } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import { CourseJsonLd } from '@/components/JsonLd'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const courses = await fetchCourses().catch(() => [])
  return courses.map((c: any) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug).catch(() => null)
  if (!course) return { title: 'קורס לא נמצא' }
  return {
    title: course.title,
    description: course.shortDescription,
  }
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await fetchCourseBySlug(slug).catch(() => null)
  if (!course) notFound()

  const imageUrl = course.thumbnail ? urlFor(course.thumbnail).width(800).height(500).url() : null

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <CourseJsonLd title={course.title} description={course.shortDescription} price={course.price} url={`https://talroman.com/courses/${slug}`} />
      <div className="max-w-4xl mx-auto px-4 py-16">
        {imageUrl && (
          <div className="relative w-full h-72 md:h-96 rounded-[24px] overflow-hidden mb-10 shadow-lg">
            <Image src={imageUrl} alt={course.title} fill className="object-cover" priority sizes="100vw" />
          </div>
        )}

        <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-4">{course.title}</h1>

        {course.shortDescription && (
          <p className="text-xl text-[#4f4f4f] mb-8 leading-relaxed">{course.shortDescription}</p>
        )}

        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-[#e6c060]/20">
          {course.price && (
            <div>
              <span className="text-sm text-[#6b6b6b]">מחיר</span>
              <p className="text-3xl font-bold text-[#cd2c2c]">{course.price}</p>
            </div>
          )}
          {course.purchaseUrl && (
            <a
              href={course.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#cd2c2c] text-white font-bold px-10 py-4 rounded-full text-lg hover:bg-[#a82424] transition-colors shadow-md"
            >
              לרכישה
            </a>
          )}
        </div>

        {course.description && (
          <div className="prose prose-lg max-w-none text-[#4f4f4f] [&_h2]:text-[#303030] [&_h3]:text-[#303030] [&_strong]:text-[#303030]">
            <PortableText value={course.description} />
          </div>
        )}
      </div>
    </div>
  )
}
