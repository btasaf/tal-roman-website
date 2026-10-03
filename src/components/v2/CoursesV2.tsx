'use client'

import Image from 'next/image'
import Link from 'next/link'
import { m, useReducedMotion } from 'framer-motion'
import { getImageUrl } from '@/lib/image-utils'
import { COURSE_TYPE_LABELS } from '@/lib/constants'
import type { Course } from '@/lib/types'
import { FadeUp, RevealHeading, enterSpring } from './motion-kit'
import { RisingColumns } from './seams'

const TOP_COLOR = '#f6e2a8'

interface Props {
  headline?: string
  courses: Course[]
}

export default function CoursesV2({ headline = 'בואו להעשיר את עצמכם ביחד איתי', courses }: Props) {
  const reduce = useReducedMotion()
  const list = courses.filter((c) => c?.slug && c?.active !== false)
  if (!list.length) return null

  return (
    <section
      className="relative z-40 pt-24 pb-28"
      style={{ background: `linear-gradient(to bottom, ${TOP_COLOR}, #f2c4b2)` }}
    >
      <RisingColumns color={TOP_COLOR} />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <RevealHeading
            text={headline}
            className="font-garamond font-extrabold tracking-tight text-[#2d1a0e] text-4xl md:text-6xl leading-tight"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((course, i) => (
            <m.div
              key={course.slug}
              initial={reduce ? false : { opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              // Stagger by column so each row cascades in
              transition={{ ...enterSpring, delay: (i % 3) * 0.1 }}
            >
              <CourseCardV2 course={course} />
            </m.div>
          ))}
        </div>

        <FadeUp className="text-center mt-14" delay={0.1}>
          <Link
            data-hide-dock
            href="/v2/courses"
            className="inline-flex items-center gap-3 border-2 border-brand text-brand-dark font-bold px-8 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors"
          >
            כל הקורסים
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}

function CourseCardV2({ course }: { course: Course }) {
  const imageUrl = getImageUrl(course.thumbnail, 'card')
  const typeLabel = course.type ? COURSE_TYPE_LABELS[course.type] ?? course.type : null
  const meta = [typeLabel, course.location?.trim()].filter(Boolean).join(' · ')
  const fitsFor = (course.whoIsItFor ?? []).map((w) => w?.trim()).filter(Boolean).slice(0, 2).join(', ')

  return (
    <Link
      href={`/v2/courses/${course.slug}`}
      className="group block h-full bg-white rounded-[28px] overflow-hidden shadow-[0_10px_40px_-14px_rgba(168,90,84,0.35)] ring-1 ring-brand/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_-18px_rgba(168,90,84,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gold/20 to-brand/10">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={course.title}
            fill
            className="object-cover saturate-[0.85] transition-[transform,filter] duration-700 ease-out group-hover:scale-105 group-hover:saturate-100"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        {/* Unifies busy thumbnails (burned-in text, mixed palettes) into one warm look */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#2d1a0e]/45 via-[#2d1a0e]/5 to-transparent pointer-events-none" />
        <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
      </div>

      <div className="p-7 text-right">
        {meta && <p className="text-sm font-bold text-brand-dark mb-1.5 line-clamp-1" title={meta}>{meta}</p>}
        <h3 className="font-garamond font-extrabold text-2xl text-[#2d1a0e] leading-snug mb-2">{course.title}</h3>
        {course.shortDescription && (
          <p className="text-[#3d2814]/85 leading-relaxed line-clamp-2 mb-3">{course.shortDescription}</p>
        )}
        {fitsFor && (
          <p className="text-sm text-[#3d2814]/85 line-clamp-1 mb-3">
            <span className="font-bold text-[#2d1a0e]">מתאים ל: </span>
            {fitsFor}
          </p>
        )}
        <span className="inline-flex items-center gap-2 mt-3 text-brand-dark font-bold">
          פרטים נוספים
          <svg className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
