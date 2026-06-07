const SOCIAL_PROFILES = [
  'https://www.instagram.com/talroman/',
  'https://www.facebook.com/tal.roman',
  'https://www.tiktok.com/@tal.roman',
  'https://www.youtube.com/@talroman',
]

export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'טל רומן',
    url: 'https://talroman.com',
    jobTitle: 'מדריכת מיניות ואינטימיות',
    sameAs: SOCIAL_PROFILES,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function WebsiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'טל רומן',
    url: 'https://talroman.com',
    description: 'קורסים, סדנאות וליווי אישי בנושא מיניות ואינטימיות לזוגות ויחידים.',
    inLanguage: 'he',
    publisher: {
      '@type': 'Person',
      name: 'טל רומן',
      url: 'https://talroman.com',
      sameAs: SOCIAL_PROFILES,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export function CourseJsonLd({ title, description, price, url }: {
  title: string
  description?: string
  price?: string
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    url,
    offers: price
      ? { '@type': 'Offer', price: price.replace(/[^\d.]/g, '') || price, priceCurrency: 'ILS' }
      : undefined,
    provider: { '@type': 'Person', name: 'טל רומן', url: 'https://talroman.com' },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
