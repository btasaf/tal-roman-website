'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/client'

interface CourseCardProps {
  title: string
  slug: string
  shortDescription?: string
  thumbnail?: object | null
  price?: string
  purchaseUrl?: string
  type?: string
  index?: number
}

const typeLabels: Record<string, string> = {
  digital: 'דיגיטלי',
  workshop: 'סדנה',
  personal: 'אישי',
}

export default function CourseCard({ title, slug, shortDescription, thumbnail, price, purchaseUrl, type, index = 0 }: CourseCardProps) {
  const imageUrl = thumbnail ? urlFor(thumbnail).width(400).height(300).url() : null

  return (
    <m.div
      className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[#e6c060]/10"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <div className="relative h-52">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#e6c060]/20 to-[#cd2c2c]/10 flex items-center justify-center">
            <span className="text-4xl">📖</span>
          </div>
        )}
        {type && (
          <span className="absolute top-3 right-3 bg-[#cd2c2c]/90 text-white text-xs font-medium px-3 py-1 rounded-full">
            {typeLabels[type] ?? type}
          </span>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#303030] mb-2">{title}</h3>
        {shortDescription && (
          <p className="text-[#4f4f4f] text-sm leading-relaxed mb-4 line-clamp-2">{shortDescription}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          {price && <span className="text-[#cd2c2c] font-semibold text-lg">{price}</span>}
          <div className="flex gap-2">
            <Link
              href={`/courses/${slug}`}
              className="text-[#cd2c2c] text-sm font-medium hover:underline"
            >
              פרטים נוספים
            </Link>
            {purchaseUrl && (
              <a
                href={purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#cd2c2c] text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-[#a82424] transition-colors"
              >
                לרכישה
              </a>
            )}
          </div>
        </div>
      </div>
    </m.div>
  )
}
