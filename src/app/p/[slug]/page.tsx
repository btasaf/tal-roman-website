import { notFound } from 'next/navigation'
import { fetchHtmlPageBySlug, fetchHtmlPages } from '@/lib/queries'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await fetchHtmlPages().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

export default async function HtmlPage({ params }: Props) {
  const { slug } = await params

  const page = await fetchHtmlPageBySlug(decodeURIComponent(slug)).catch(() => null)

  if (!page || !page.htmlFileUrl) notFound()

  // Fetch the HTML content from the file URL
  const htmlContent = await fetch(page.htmlFileUrl).then(res => res.text()).catch(() => null)

  if (!htmlContent) notFound()

  // Render the uploaded file as its own document, so it looks exactly as it does
  // when opened on its own: its html/body styling (centring, background) applies,
  // and its CSS cannot leak onto the rest of the site.
  return (
    <iframe
      srcDoc={htmlContent}
      title={page.title}
      className="fixed inset-0 z-[9999] h-full w-full border-0 bg-white"
    />
  )
}
