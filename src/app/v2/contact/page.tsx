import type { Metadata } from 'next'
import { fetchSiteSettings } from '@/lib/queries'
import { BreadcrumbJsonLd } from '@/components/JsonLd'
import ContactPageV2 from '@/components/v2/contact-page/ContactPageV2'

const URL = 'https://www.talroman.com/contact'
const TITLE = 'צור קשר | טל רומן'
const DESCRIPTION = 'יש לכם שאלה? רוצים להתחיל תהליך? צרו קשר עם טל רומן — מדריכת מיניות ואינטימיות.'

// Same values as the live page; v2 stays out of the index until it replaces it
export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: false, follow: true },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, locale: 'he_IL', type: 'website', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.jpg'] },
}

export default async function ContactV2Page() {
  const settings = await fetchSiteSettings().catch(() => null)

  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: TITLE,
    description: DESCRIPTION,
    url: URL,
    inLanguage: 'he',
    mainEntity: {
      '@type': 'Person',
      name: 'טל רומן',
      url: 'https://www.talroman.com',
      ...(settings?.phone ? { telephone: settings.phone } : {}),
    },
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
          { name: 'טל רומן', url: 'https://www.talroman.com' },
          { name: 'צור קשר', url: URL },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <ContactPageV2 settings={settings} />
    </>
  )
}
