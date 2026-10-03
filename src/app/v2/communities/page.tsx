import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'
import { siteStats } from '@/components/v2/site-stats'
import CommunitiesV2 from '@/components/v2/communities/CommunitiesV2'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

const TITLE = 'קהילות — טל רומן'
const DESCRIPTION = 'הצטרפו לקהילות הפייסבוק והוואטסאפ של טל רומן — מעל 22,000 נשים וגברים שלומדים ומתחברים סביב מיניות, זוגיות ואינטימיות.'

// v2 stays out of the index until it replaces the live pages
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: 'https://www.talroman.com/communities' },
  robots: { index: false, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://www.talroman.com/communities',
    locale: 'he_IL',
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function CommunitiesV2Page() {
  const settings = await fetchSiteSettings().catch(() => null)
  return (
    <>
      {/* Same overrides as the v2 homepage: no root top padding, no WhatsApp FAB */}
      <style>{`
        main.pt-20 { padding-top: 0 !important; }
        .fixed.bottom-6.left-6 { display: none !important; }
      `}</style>
      <BreadcrumbJsonLd
        items={[
          { name: 'טל רומן', url: 'https://www.talroman.com' },
          { name: 'קהילות', url: 'https://www.talroman.com/communities' },
        ]}
      />
      <div>
        <CommunitiesV2 members={siteStats(settings).community} />
      </div>
    </>
  )
}
