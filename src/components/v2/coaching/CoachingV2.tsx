import type { Testimonial } from '@/lib/types'
import CoachingHero from './CoachingHero'
import CoachingStory from './CoachingStory'
import CoachingFit from './CoachingFit'
import CoachingLearn from './CoachingLearn'
import CoachingVoices from './CoachingVoices'
import CoachingPricing from './CoachingPricing'
import CoachingFAQ from './CoachingFAQ'
import CoachingContact from './CoachingContact'

// v2 personal coaching: offer → personal letter + approach → who it's for → what we'll learn →
// testimonials → location & cost → FAQ → contact form
export default function CoachingV2({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="relative overflow-x-clip bg-cream">
      <CoachingHero />
      <CoachingStory />
      <CoachingFit />
      <CoachingLearn />
      <CoachingVoices testimonials={testimonials} />
      <CoachingPricing />
      <CoachingFAQ />
      <CoachingContact />
      {/* Cream continues under the footer's rounded shoulders (the page behind is dark) */}
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}
