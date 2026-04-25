/**
 * Downloads all images from talroman.com into public/wix-assets/
 * Groups them by page and type (hero, gallery, profile, etc.)
 *
 * Run: npx ts-node --esm scripts/download-wix-images.ts
 */

import { chromium } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import * as crypto from 'crypto'

const SITE_URL = 'https://www.talroman.com'
const OUT_DIR = path.join(process.cwd(), 'public', 'wix-assets')

const PAGES = [
  { name: 'home',         url: '/' },
  { name: 'about',        url: '/about-tal-roman' },
  { name: 'workshops',    url: '/סדנאות' },
  { name: 'blog',         url: '/blog' },
  { name: 'media',        url: '/media' },
  { name: 'gallery',      url: '/gallery' },
  { name: 'testimonials', url: '/recommendation' },
  { name: 'communities',  url: '/facebookgroups' },
]

interface ImageInfo {
  src: string
  alt: string
  width: number
  height: number
  role: string
  page: string
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

function ext(url: string): string {
  const u = url.split('?')[0]
  const m = u.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i)
  return m ? m[1].toLowerCase() : 'jpg'
}

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(dest)
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.destroy()
        fs.unlinkSync(dest)
        return download(res.headers.location!, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.destroy()
        fs.unlinkSync(dest)
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve()))
    })
    req.on('error', (e) => { fs.existsSync(dest) && fs.unlinkSync(dest); reject(e) })
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function extractImages(page: any, pageName: string): Promise<ImageInfo[]> {
  return page.evaluate((pName: string) => {
    const images: any[] = []
    const seen = new Set<string>()

    function add(src: string, alt: string, w: number, h: number, role: string) {
      if (!src || seen.has(src)) return
      if (src.includes('data:')) return
      if (src.includes('favicon')) return
      if (w < 60 || h < 60) return
      seen.add(src)
      images.push({ src, alt: alt || '', width: Math.round(w), height: Math.round(h), role, page: pName })
    }

    // <img> tags
    document.querySelectorAll('img').forEach(img => {
      const rect = img.getBoundingClientRect()
      const src = img.src || img.getAttribute('data-src') || ''
      if (!src) return

      let role = 'image'
      const cls = (img.className || '').toString().toLowerCase()
      const alt = img.alt || ''
      if (cls.includes('hero') || cls.includes('banner') || rect.height > 400) role = 'hero'
      else if (cls.includes('profile') || cls.includes('portrait') || alt.includes('טל')) role = 'portrait'
      else if (cls.includes('gallery') || cls.includes('thumb')) role = 'gallery'
      else if (rect.width > 600) role = 'section'

      add(src, alt, rect.width || img.naturalWidth, rect.height || img.naturalHeight, role)
    })

    // Background images via computed style
    document.querySelectorAll('[style*="background"]').forEach(el => {
      const style = window.getComputedStyle(el)
      const bg = style.backgroundImage
      const match = bg.match(/url\(["']?([^"')]+)["']?\)/)
      if (!match) return
      const rect = (el as HTMLElement).getBoundingClientRect()
      add(match[1], '', rect.width, rect.height, rect.height > 300 ? 'background' : 'image')
    })

    // Wix-specific: wix-image components
    document.querySelectorAll('wix-image, [data-type="wix-image"], [data-media-id]').forEach(el => {
      const inner = el.querySelector('img')
      if (inner?.src) {
        const rect = el.getBoundingClientRect()
        add(inner.src, inner.alt || '', rect.width || 200, rect.height || 200, 'wix-image')
      }
    })

    return images
  }, pageName)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    locale: 'he-IL',
  })
  const page = await context.newPage()

  // First discover real page URLs from nav (same as scraper)
  console.log('🔍 Discovering pages...')
  await page.goto(SITE_URL, { waitUntil: 'load', timeout: 45000 })
  await page.waitForTimeout(3000)

  const navPages = await page.evaluate((base: string) => {
    const anchors = Array.from(document.querySelectorAll('nav a, header a, [class*="menu"] a'))
    const seen = new Set<string>()
    const result: Array<{ name: string; url: string }> = [{ name: 'home', url: base }]
    anchors.forEach(a => {
      const href = (a as HTMLAnchorElement).href
      const text = (a as HTMLAnchorElement).innerText?.trim()
      if (!href || !text || !href.startsWith(base) || seen.has(href) || href.includes('#')) return
      seen.add(href)
      result.push({ name: text, url: href })
    })
    return result
  }, SITE_URL)

  console.log(`Found ${navPages.length} pages\n`)

  const manifest: Record<string, ImageInfo[]> = {}
  const allImages: ImageInfo[] = []

  for (const { name, url } of navPages) {
    console.log(`📄 ${name} — ${url}`)
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 45000 })
      await page.waitForTimeout(3000)

      // Scroll to trigger lazy images
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise(r => setTimeout(r, 200))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(1000)

      const images = await extractImages(page, name)
      manifest[name] = images
      allImages.push(...images)
      console.log(`  Found ${images.length} images`)
    } catch (err) {
      console.warn(`  ⚠ Skipped: ${(err as Error).message.slice(0, 80)}`)
    }
  }

  await browser.close()

  // Download all unique images
  console.log(`\n⬇ Downloading ${allImages.length} images...`)
  const downloaded: Record<string, string> = {}
  let count = 0

  for (const img of allImages) {
    const pageDir = path.join(OUT_DIR, img.page)
    fs.mkdirSync(pageDir, { recursive: true })

    const hash = crypto.createHash('md4').update(img.src).digest('hex').slice(0, 8)
    const altSlug = slugify(img.alt || img.role)
    const filename = `${img.role}-${altSlug}-${hash}.${ext(img.src)}`
    const dest = path.join(pageDir, filename)
    const publicPath = `/wix-assets/${img.page}/${filename}`

    if (fs.existsSync(dest)) {
      downloaded[img.src] = publicPath
      continue
    }

    try {
      await download(img.src, dest)
      downloaded[img.src] = publicPath
      count++
      process.stdout.write(`  ✓ ${filename}\n`)
    } catch (e) {
      process.stdout.write(`  ✗ ${filename} — ${(e as Error).message}\n`)
    }
  }

  // Write manifest
  const manifestPath = path.join(OUT_DIR, 'manifest.json')
  const enrichedManifest = Object.entries(manifest).map(([page, imgs]) => ({
    page,
    images: imgs.map(img => ({
      ...img,
      localPath: downloaded[img.src] || null,
    }))
  }))
  fs.writeFileSync(manifestPath, JSON.stringify(enrichedManifest, null, 2))

  console.log(`\n✅ Downloaded ${count} images → public/wix-assets/`)
  console.log(`📋 Manifest → ${manifestPath}`)
  console.log('\nImages are now available at /wix-assets/<page>/<filename>')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
