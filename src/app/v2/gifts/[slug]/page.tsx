import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { fetchAllTestimonials, fetchGiftBySlug, fetchGifts, fetchHomepageSection, fetchSiteSettings } from '@/lib/queries'
import type { Gift, Testimonial } from '@/lib/types'
import { getImageUrl } from '@/lib/image-utils'
import { urlFor } from '@/sanity/client'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import GiftPageV2 from '@/components/v2/gifts-page/GiftPageV2'

interface Props {
  params: Promise<{ slug: string }>
}

// Like the live page: only gifts that exist get a page, unknown slugs 404
export const dynamicParams = false

export async function generateStaticParams() {
  const gifts: Gift[] = await fetchGifts().catch(() => [])
  return gifts.map((g) => ({ slug: g.slug }))
}

const canonical = (slug: string) => `https://www.talroman.com/gifts/${slug}`

// Same values as the live page; v2 stays out of the index until it replaces it
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const gift = await fetchGiftBySlug(decodeURIComponent(slug)).catch(() => null)
  if (!gift) return { title: { absolute: 'מתנה לא נמצאה | טל רומן' }, robots: { index: false, follow: true } }
  const imageUrl = getImageUrl(gift.image ?? null, 'detail')
  const url = canonical(slug)
  const title = `${gift.heroHeadline ?? gift.title} | טל רומן`
  const description = gift.secondaryText ?? gift.subtitle
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      locale: 'he_IL',
      type: 'website',
      ...(imageUrl ? { images: [{ url: imageUrl, width: 1200, height: 600 }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description, ...(imageUrl ? { images: [imageUrl] } : {}) },
  }
}

export default async function GiftV2Page({ params }: Props) {
  const { slug } = await params

  const [gift, testimonials, homepage, settings] = await Promise.all([
    fetchGiftBySlug(decodeURIComponent(slug)).catch(() => null),
    fetchAllTestimonials().catch(() => [] as Testimonial[]),
    fetchHomepageSection().catch(() => null),
    fetchSiteSettings().catch(() => null),
  ])

  if (!gift) notFound()

  // Uncropped cover (the frame crops it), and the About portrait from the homepage document
  const imageUrl = gift.image ? urlFor(gift.image).width(1400).auto('format').url() : null
  const aboutImageUrl = getImageUrl(homepage?.aboutImage ?? null, 'about')

  return (
    <>
      {/* Same overrides as the other v2 pages: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <BreadcrumbJsonLd
        items={[
          { name: 'דף הבית', url: 'https://www.talroman.com' },
          { name: gift.title, url: canonical(slug) },
        ]}
      />
      <GiftPageV2
        gift={gift}
        slug={slug}
        imageUrl={imageUrl}
        testimonials={testimonials.slice(0, 6)}
        aboutImageUrl={aboutImageUrl}
        aboutBio={homepage?.aboutBio}
        settings={settings}
      />
    </>
  )
}
