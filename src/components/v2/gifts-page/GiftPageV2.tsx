import type { Gift, SiteSettings, Testimonial } from '@/lib/types'
import { siteStats } from '../site-stats'
import GiftHero from './GiftHero'
import GiftLetter from './GiftLetter'
import GiftInside from './GiftInside'
import GiftVoices from './GiftVoices'
import GiftAbout from './GiftAbout'
import GiftSignup from './GiftSignup'
import GiftDock from './GiftDock'

const FALLBACK_PORTRAIT = '/wix-assets/images/tal-photos/VV9A8415%20copy.jpg'

// v2 free-gift landing: the gift → who it's for + Tal's letter → what's inside → testimonials → who's Tal → email form
export default function GiftPageV2({
  gift,
  slug,
  imageUrl,
  testimonials,
  aboutImageUrl,
  aboutBio,
  settings,
}: {
  gift: Gift
  slug: string
  imageUrl: string | null
  testimonials: Testimonial[]
  aboutImageUrl: string | null
  aboutBio?: string
  settings: SiteSettings | null
}) {
  const stats = siteStats(settings)
  // Only the bio's opening line: the rest of the field is long-form copy for the About page
  const bioLine = aboutBio?.split('\n').map((l) => l.trim()).find(Boolean)

  return (
    <div className="relative overflow-x-clip bg-cream">
      <GiftHero
        title={gift.title}
        kicker={gift.subtitle}
        overline={gift.heroSubheadline}
        headline={gift.heroHeadline ?? gift.title}
        imageUrl={imageUrl}
      />
      <GiftLetter title={gift.title} audience={gift.subtitle} body={gift.mainBody} />
      <GiftInside items={gift.listItems ?? []} />
      <GiftVoices testimonials={testimonials} />
      <GiftAbout imageUrl={aboutImageUrl ?? FALLBACK_PORTRAIT} bio={bioLine} years={stats.years} community={stats.community} />
      <GiftSignup
        title={gift.title}
        imageUrl={imageUrl}
        lead={gift.secondaryText}
        tag={gift.crmTags}
        status={gift.crmStatus}
        enrollToSchool={gift.enrollToSchool}
        slug={slug}
      />
      <GiftDock />
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}
