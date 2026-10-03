'use client'

import { MotionConfig } from 'framer-motion'
import type { PresalePage, Testimonial } from '@/lib/types'
import PresaleHero from './PresaleHero'
import PresalePromise from './PresalePromise'
import PresaleBenefits from './PresaleBenefits'
import PresaleVoices from './PresaleVoices'
import PresaleOffer from './PresaleOffer'
import PresaleDock from './PresaleDock'
import { GrainOverlay } from '../backgrounds'

// v2 presale landing page: Tal's note + the offer → the promise → what's in the course →
// what learners said → the closing offer card. A docked price bar fills the gaps between purchase buttons.
// reducedMotion="user": reduced-motion visitors get fades only (entrances skip their transforms).
export default function PresaleV2({ page, testimonials, deviceImageUrl }: { page: PresalePage; testimonials: Testimonial[]; deviceImageUrl: string | null }) {
  const href = page.ctaButtonLink || '#'

  return (
    <MotionConfig reducedMotion="user">
      <div dir="rtl" className="relative overflow-x-clip bg-cream">
        <PresaleHero page={page} href={href} />
        <PresalePromise lines={page.bodyLines ?? []} />
        <PresaleBenefits benefits={page.benefits ?? []} courseTitle={page.courseTitle} />
        <PresaleVoices testimonials={testimonials} />
        <PresaleOffer page={page} href={href} deviceImageUrl={deviceImageUrl} />
        {page.ctaButtonText && <PresaleDock href={href} label={page.ctaButtonText} now={page.priceNew} was={page.priceOld} />}
        {/* Cream continues under the footer's rounded shoulders */}
        <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none">
          <GrainOverlay />
        </div>
      </div>
    </MotionConfig>
  )
}
