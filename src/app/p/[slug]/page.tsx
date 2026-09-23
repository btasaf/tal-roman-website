import { notFound } from 'next/navigation'
import { fetchHtmlPageBySlug, fetchHtmlPages, fetchSiteSettings } from '@/lib/queries'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await fetchHtmlPages().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

export default async function HtmlPage({ params }: Props) {
  const { slug } = await params

  const [page, settings] = await Promise.all([
    fetchHtmlPageBySlug(decodeURIComponent(slug)).catch(() => null),
    fetchSiteSettings().catch(() => null),
  ])

  if (!page || !page.htmlFileUrl) notFound()

  // Fetch the HTML content from the file URL
  const htmlContent = await fetch(page.htmlFileUrl).then(res => res.text()).catch(() => null)

  if (!htmlContent) notFound()

  const showHeader = page.showHeader === true
  const showFooter = page.showFooter === true

  // Render as full-screen overlay that covers root layout's Nav/Footer
  // Then add our own Nav/Footer based on toggles
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto flex flex-col -mt-20">
      {showHeader && <Nav />}
      <main className={`flex-1 ${showHeader ? 'pt-20' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </main>
      {showFooter && <Footer settings={settings} />}
    </div>
  )
}
