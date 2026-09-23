import { notFound } from 'next/navigation'
import { fetchHtmlPageBySlug, fetchHtmlPages } from '@/lib/queries'

interface Props {
  params: Promise<{ slug: string }>
}

// Don't generate pages for unknown slugs - return 404 immediately
export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await fetchHtmlPages().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

export default async function HtmlPage({ params }: Props) {
  const { slug } = await params

  const page = await fetchHtmlPageBySlug(decodeURIComponent(slug)).catch(() => null)

  if (!page || !page.htmlFileUrl) notFound()

  // Render the uploaded file in an iframe that loads directly from Sanity's CDN.
  // This avoids embedding the entire HTML content (potentially megabytes) into
  // the Next.js page, reducing ISR write size dramatically.
  return (
    <iframe
      src={page.htmlFileUrl}
      title={page.title}
      className="fixed inset-0 z-[9999] h-full w-full border-0 bg-white"
    />
  )
}
