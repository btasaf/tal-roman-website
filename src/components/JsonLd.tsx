export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'טל רומן',
    url: 'https://talroman.com',
    jobTitle: 'מדריכת מיניות ואינטימיות',
    sameAs: [],
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
