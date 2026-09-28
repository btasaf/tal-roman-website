import { notFound } from 'next/navigation'
import { fetchHtmlPageBySlug, fetchHtmlPagesForBuild } from '@/lib/queries'

interface Props {
  params: Promise<{ slug: string }>
}

// Don't generate pages for unknown slugs - return 404 immediately
export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await fetchHtmlPagesForBuild().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

export default async function HtmlPage({ params }: Props) {
  const { slug } = await params

  const page = await fetchHtmlPageBySlug(decodeURIComponent(slug)).catch(() => null)

  if (!page || !page.htmlFileUrl) notFound()

  // Served through our own domain rather than Sanity's CDN, whose CSP strips the file's
  // inline styles and scripts (see ./file/route.ts). The content still never enters this
  // page's HTML, so the ISR write stays small.
  return (
    <iframe
      src={`/p/${encodeURIComponent(slug)}/file`}
      title={page.title}
      className="fixed inset-0 z-[9999] h-full w-full border-0 bg-white"
    />
  )
}
