'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/image-utils'
import { COURSE_TYPE_LABELS } from '@/lib/constants'
import type { Course } from '@/lib/types'

interface CourseCardProps extends Course {
  index?: number
}

export default function CourseCard({ title, slug, shortDescription, thumbnail, price, purchaseUrl, type, index = 0 }: CourseCardProps) {
  const imageUrl = getImageUrl(thumbnail, 'card')

  return (
    <m.div
      className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gold/10"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="relative h-52">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/20 to-brand/10 flex items-center justify-center">
            <span className="text-4xl">📖</span>
          </div>
        )}
        {type && (
          <span className="absolute top-3 right-3 bg-brand/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            {COURSE_TYPE_LABELS[type] ?? type}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-ink mb-2">{title}</h3>
        {shortDescription && (
          <p className="text-charcoal text-sm leading-relaxed mb-4 line-clamp-2">{shortDescription}</p>
        )}
        <div className="flex items-center justify-end mt-auto">
          <Link
            href={`/courses/${slug}`}
            className="bg-brand text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-brand-dark transition-colors"
          >
            פרטים נוספים
          </Link>
        </div>
      </div>
    </m.div>
  )
}
