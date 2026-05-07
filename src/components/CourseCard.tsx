'use client'

import { useRef, useCallback } from 'react'
import { m } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import CTAButton from '@/components/ui/CTAButton'
import { COURSE_TYPE_LABELS } from '@/lib/constants'
import type { Course } from '@/lib/types'
import MagneticButton from '@/components/ui/MagneticButton'

interface CourseCardProps extends Course {
  index?: number
}

export default function CourseCard({ title, slug, shortDescription, thumbnail, type, index = 0 }: CourseCardProps) {
  const imageUrl = getImageUrl(thumbnail, 'card')
  const cardRef = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02,1.02,1.02)`
    el.style.transition = 'transform 0.1s ease'
  }, [])

  const onLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
  }, [])

  return (
    <m.div
      initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl border border-gold/10 cursor-default"
        style={{ willChange: 'transform' }}
      >
        <div className="relative h-52 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
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
            <MagneticButton>
              <CTAButton href={`/courses/${slug}`} className="text-sm font-medium px-5 py-2.5 rounded-full">
                פרטים נוספים
              </CTAButton>
            </MagneticButton>
          </div>
        </div>
      </div>
    </m.div>
  )
}
