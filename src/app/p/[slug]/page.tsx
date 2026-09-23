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

  // Clean full-screen render - covers root layout's Nav/Footer completely
  return (
    <div className="fixed inset-0 z-[9999] overflow-auto bg-white" style={{ marginTop: '-80px', paddingTop: '0' }}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  )
}
