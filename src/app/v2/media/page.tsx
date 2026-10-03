import type { Metadata } from 'next'
import { fetchHomepageSection, fetchMediaMentions } from '@/lib/queries'
import type { MediaMention } from '@/lib/types'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import MediaPageV2 from '@/components/v2/media-page/MediaPageV2'
import { buildMedia } from '@/components/v2/media-page/media-data'

const URL = 'https://www.talroman.com/media'
const TITLE = 'טל רומן בתקשורת'
const DESCRIPTION = 'כתבות, ראיונות והופעות תקשורתיות של טל רומן — מדריכת מיניות ואינטימיות — ב-ynet, מאקו, וואלה ועוד.'
// Same reel as the homepage media section (Sanity: דף הבית → בתקשורת), with the same fallback
const DEFAULT_REEL = 'https://vimeo.com/1232565131'

// Same title and description as the live page; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, locale: 'he_IL', type: 'website', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function MediaV2Page() {
  const [mentions, homepage] = await Promise.all([
    fetchMediaMentions().catch(() => [] as MediaMention[]),
    fetchHomepageSection().catch(() => null),
  ])
  const items = buildMedia(mentions ?? [])

  // The coverage itself, as a list of the external stories (no ratings or reviews implied)
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'טל רומן בתקשורת',
    itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, url: it.url, name: it.title })),
  }

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
          { name: 'בתקשורת', url: URL },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, '\\u003c') }} />
      <MediaPageV2 items={items} reelUrl={homepage?.mediaBackgroundVideo || DEFAULT_REEL} />
    </>
  )
}
