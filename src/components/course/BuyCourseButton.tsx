'use client'

import CTAButton from '@/components/ui/CTAButton'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface Props {
  href: string
  label?: string
  slug: string
}

export default function BuyCourseButton({ href, label, slug }: Props) {
  const { track } = useCrmTracking()
  return (
    <span onClick={() => track(`click_buy_course/${slug}`)}>
      <CTAButton href={href} target="_blank" rel="noopener noreferrer" variant="gold" className="rounded-full text-base md:text-lg shadow-lg shadow-gold/20 px-6 md:px-10 py-3 md:py-4 w-full sm:w-auto text-center whitespace-normal block sm:inline-block">
        {label || 'לרכישה עכשיו'}
      </CTAButton>
    </span>
  )
}
