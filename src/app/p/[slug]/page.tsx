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

  return (
    <>
      {page.showHeader === true && <Nav />}
      <main className={page.showHeader === true ? 'pt-20' : ''}>
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </main>
      {page.showFooter === true && <Footer settings={settings} />}
    </>
  )
}
