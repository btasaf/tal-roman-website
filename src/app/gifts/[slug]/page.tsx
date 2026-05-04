import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  fetchGiftBySlug,
  fetchGifts,
  fetchAllTestimonials,
  fetchSiteSettings,
  fetchMediaMentions,
  fetchHomepageSection,
} from '@/lib/queries'
import type { Gift, Testimonial } from '@/lib/types'
import GiftPageContent from '@/components/GiftPageContent'
import RecommendersSection from '@/components/RecommendersSection'
import MediaMentionsSection from '@/components/MediaMentionsSection'
import AboutSection from '@/components/AboutSection'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const gifts: Gift[] = await fetchGifts().catch(() => [])
  return gifts.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const gift = await fetchGiftBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!gift) return { title: 'מתנה לא נמצאה' }
  return {
    title: gift.heroHeadline ?? gift.title,
    description: gift.secondaryText ?? gift.subtitle,
  }
}

export default async function GiftPage({ params }: Props) {
  const { slug } = await params

  const [gift, testimonials, mediaMentions, homepage] = await Promise.all([
    fetchGiftBySlug(decodeURIComponent(slug)).catch(() => null),
    fetchAllTestimonials().catch(() => [] as Testimonial[]),
    fetchMediaMentions().catch(() => []),
    fetchHomepageSection().catch(() => null),
  ])

  if (!gift) notFound()

  return (
    <div>
      <GiftPageContent gift={gift} slug={slug} />

      <RecommendersSection
        testimonials={testimonials.slice(0, 6)}
        bgImage={homepage?.testimonialsBgImage ?? null}
      />

      <MediaMentionsSection mentions={mediaMentions} />

      {(homepage?.aboutBio || homepage?.aboutQuote || homepage?.aboutImage) && (
        <AboutSection
          aboutImage={homepage?.aboutImage ?? null}
          aboutBio={homepage?.aboutBio ?? ''}
          aboutQuote={homepage?.aboutQuote ?? ''}
          bgImage={homepage?.aboutBgImage ?? null}
        />
      )}
    </div>
  )
}
