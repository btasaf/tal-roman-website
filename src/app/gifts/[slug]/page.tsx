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
import { getImageUrl } from '@/lib/image-utils'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
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
  const imageUrl = getImageUrl(gift.image ?? null, 'detail')
  const canonicalUrl = `https://www.talroman.com/gifts/${slug}`
  const title = gift.heroHeadline ?? gift.title
  const description = gift.secondaryText ?? gift.subtitle
  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: 'he_IL',
      type: 'website',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 600 }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
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
      <BreadcrumbJsonLd items={[
        { name: 'דף הבית', url: 'https://www.talroman.com' },
        { name: gift.title, url: `https://www.talroman.com/gifts/${slug}` },
      ]} />
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
