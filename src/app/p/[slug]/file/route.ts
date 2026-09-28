import { fetchHtmlPageBySlug } from '@/lib/queries'

interface Props {
  params: Promise<{ slug: string }>
}

// Sanity's CDN serves uploaded files with `content-security-policy: default-src 'self';
// script-src 'none'`, which strips inline <style>, inline <script> and data: images — an
// uploaded page loaded straight from there renders as unstyled text. Streaming it through
// our own domain drops that header, so the file renders exactly as it does on its own,
// while the page itself stays small (the content never enters the prerendered HTML).
export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params
  const page = await fetchHtmlPageBySlug(decodeURIComponent(slug)).catch(() => null)

  if (!page?.htmlFileUrl) return new Response('Not found', { status: 404 })

  const upstream = await fetch(page.htmlFileUrl)
  if (!upstream.ok || !upstream.body) return new Response('Not found', { status: 404 })

  return new Response(upstream.body, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
