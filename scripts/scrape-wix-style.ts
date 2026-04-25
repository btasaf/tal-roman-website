/**
 * One-time Wix style scraper for talroman.com
 * Auto-discovers all pages from the nav, screenshots them, extracts full design tokens.
 *
 * Run:
 *   npx ts-node --esm scripts/scrape-wix-style.ts
 */

import { chromium, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'

const SITE_URL = 'https://www.talroman.com'
const OUT_DIR = path.join(process.cwd(), 'wix-scrape')
const SCREENSHOTS_DIR = path.join(OUT_DIR, 'screenshots')

const STYLE_PROPS = [
  'color', 'background-color', 'background-image',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
  'margin-top', 'margin-bottom',
  'border-radius', 'border', 'border-color', 'border-width',
  'box-shadow', 'text-shadow',
  'gap', 'max-width', 'min-height', 'opacity',
  'text-align', 'direction', 'display', 'flex-direction',
]

async function waitForPage(page: Page) {
  await page.waitForLoadState('load', { timeout: 45000 })
  // Extra wait for Wix's JS to hydrate
  await page.waitForTimeout(3000)
  // Dismiss cookie banners / popups
  for (const sel of [
    '[data-hook="consent-banner-agree-btn"]',
    '[class*="cookie"] button',
    '[class*="GDPR"] button',
    'button[aria-label*="accept"]',
    'button[aria-label*="סגור"]',
    'button[aria-label*="close"]',
  ]) {
    try { await page.click(sel, { timeout: 800 }) } catch {}
  }
}

async function discoverPages(page: Page): Promise<Array<{ name: string; url: string }>> {
  console.log('🔍 Discovering pages from navigation...')
  await page.goto(SITE_URL, { waitUntil: 'load', timeout: 45000 })
  await page.waitForTimeout(3000)

  const links = await page.evaluate((base: string) => {
    const anchors = Array.from(document.querySelectorAll('nav a, header a, [class*="menu"] a, [class*="nav"] a'))
    const seen = new Set<string>()
    const result: Array<{ name: string; url: string }> = []

    anchors.forEach(a => {
      const href = (a as HTMLAnchorElement).href
      const text = (a as HTMLAnchorElement).innerText?.trim()
      if (!href || !text) return
      if (!href.startsWith(base)) return
      if (seen.has(href)) return
      if (href.includes('#')) return
      seen.add(href)
      result.push({ name: text, url: href })
    })

    // Also add home if not found
    if (!result.find(r => r.url === base || r.url === base + '/')) {
      result.unshift({ name: 'בית', url: base })
    }

    return result
  }, SITE_URL)

  // Always ensure home is first
  const home = { name: 'home', url: SITE_URL }
  const unique = [home, ...links.filter(l => l.url !== SITE_URL && l.url !== SITE_URL + '/')]

  console.log(`  Found ${unique.length} pages:`, unique.map(u => u.name).join(', '))
  return unique
}

async function extractPageStyles(page: Page) {
  return page.evaluate((props: string[]) => {
    const SELECTORS = [
      { label: 'body', sel: 'body' },
      { label: 'h1', sel: 'h1' },
      { label: 'h2', sel: 'h2' },
      { label: 'h3', sel: 'h3' },
      { label: 'paragraph', sel: 'p' },
      { label: 'link', sel: 'a' },
      { label: 'nav', sel: 'nav, header' },
      { label: 'footer', sel: 'footer' },
      { label: 'button', sel: 'button' },
    ]

    const result: Record<string, Record<string, string>> = {}

    for (const { label, sel } of SELECTORS) {
      const el = document.querySelector(sel)
      if (!el) continue
      const computed = window.getComputedStyle(el)
      const styles: Record<string, string> = {}
      for (const prop of props) {
        const val = computed.getPropertyValue(prop).trim()
        if (val) styles[prop] = val
      }
      result[label] = styles
    }

    return result
  }, STYLE_PROPS)
}

async function extractAllSectionColors(page: Page) {
  return page.evaluate(() => {
    const colors = new Set<string>()
    const allEls = document.querySelectorAll('*')

    allEls.forEach(el => {
      const computed = window.getComputedStyle(el)
      const bg = computed.backgroundColor
      const fg = computed.color
      const border = computed.borderColor

      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') colors.add(bg)
      if (fg && fg !== 'rgba(0, 0, 0, 0)') colors.add(fg)
      if (border && border !== 'rgba(0, 0, 0, 0)') colors.add(border)
    })

    return Array.from(colors)
  })
}

async function extractSectionStructure(page: Page) {
  return page.evaluate(() => {
    // Wix uses data-mesh-id, data-testid, or [id] on sections
    const candidates = document.querySelectorAll(
      '[data-mesh-id], [data-testid], section, [class*="StripContainer"], [class*="strip"], [class*="Section"]'
    )

    const sections: Array<{
      tag: string
      id: string
      className: string
      bg: string
      padding: string
      height: string
      text: string
      childCount: number
    }> = []

    candidates.forEach((el, i) => {
      if (i > 40) return
      const rect = el.getBoundingClientRect()
      if (rect.height < 80) return

      const computed = window.getComputedStyle(el)
      const bg = computed.backgroundColor

      sections.push({
        tag: el.tagName.toLowerCase(),
        id: el.id || (el as HTMLElement).dataset?.testid || (el as HTMLElement).dataset?.meshId || '',
        className: el.className?.toString().slice(0, 100) ?? '',
        bg,
        padding: computed.padding,
        height: `${Math.round(rect.height)}px`,
        text: (el as HTMLElement).innerText?.slice(0, 120).replace(/\n+/g, ' ').trim() ?? '',
        childCount: el.children.length,
      })
    })

    return sections
  })
}

async function extractFonts(page: Page): Promise<string[]> {
  return page.evaluate(() => {
    const fonts = new Set<string>()

    // From link tags (Google Fonts / Wix Fonts)
    document.querySelectorAll('link[href*="fonts.googleapis"], link[href*="fonts.gstatic"], link[href*="font"]').forEach(el => {
      const href = (el as HTMLLinkElement).href
      const matches = href.matchAll(/family=([^&:;]+)/g)
      for (const m of matches) {
        fonts.add(decodeURIComponent(m[1]).replace(/\+/g, ' ').split(':')[0].trim())
      }
    })

    // From @font-face in stylesheets
    try {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSFontFaceRule) {
              const family = rule.style.getPropertyValue('font-family').replace(/['"]/g, '')
              if (family) fonts.add(family)
            }
          }
        } catch {}
      }
    } catch {}

    // From computed styles
    for (const sel of ['body', 'h1', 'h2', 'p', 'button', 'nav']) {
      const el = document.querySelector(sel)
      if (el) {
        const font = window.getComputedStyle(el).fontFamily
        const first = font?.split(',')[0]?.replace(/['"]/g, '').trim()
        if (first) fonts.add(first)
      }
    }

    return Array.from(fonts).filter(Boolean)
  })
}

function rgbToHex(rgb: string): string {
  const m = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return rgb
  return '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
}

function dedupeColors(colors: string[]): string[] {
  const hexes = colors.map(c => {
    try { return rgbToHex(c) } catch { return c }
  })
  return [...new Set(hexes)].filter(c => c !== '#000000' || colors.includes('rgb(0, 0, 0)'))
}

async function scrapePage(page: Page, name: string, url: string) {
  console.log(`\n📄 Scraping: ${name} — ${url}`)
  await page.setViewportSize({ width: 1440, height: 900 })

  await page.goto(url, { waitUntil: 'load', timeout: 45000 })
  await waitForPage(page)

  const title = await page.title()
  console.log(`  Title: ${title}`)

  // Full-page desktop screenshot
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name.replace(/[^a-z0-9]/gi, '-')}-desktop.png`),
    fullPage: true,
  })

  // Mobile screenshot
  await page.setViewportSize({ width: 390, height: 844 })
  await page.waitForTimeout(800)
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, `${name.replace(/[^a-z0-9]/gi, '-')}-mobile.png`),
    fullPage: true,
  })
  await page.setViewportSize({ width: 1440, height: 900 })

  const [styles, colors, sections, fonts] = await Promise.all([
    extractPageStyles(page),
    extractAllSectionColors(page),
    extractSectionStructure(page),
    extractFonts(page),
  ])

  // Also extract CSS custom properties (Wix uses --color-1 etc)
  const cssVars = await page.evaluate(() => {
    const vars: Record<string, string> = {}
    const style = window.getComputedStyle(document.documentElement)
    const allProps = Array.from(document.styleSheets).flatMap(sheet => {
      try {
        return Array.from(sheet.cssRules).flatMap(rule => {
          if (rule instanceof CSSStyleRule && rule.selectorText === ':root') {
            return Array.from(rule.style).filter(p => p.startsWith('--'))
          }
          return []
        })
      } catch { return [] }
    })
    for (const prop of allProps) {
      vars[prop] = style.getPropertyValue(prop).trim()
    }
    return vars
  })

  console.log(`  ✓ ${Object.keys(styles).length} element styles, ${sections.length} sections, ${fonts.length} fonts, ${Object.keys(cssVars).length} CSS vars`)

  return { name, url, title, styles, colors: dedupeColors(colors), sections, fonts, cssVars }
}

function buildReport(pages: Awaited<ReturnType<typeof scrapePage>>[]) {
  const allColors = dedupeColors(pages.flatMap(p => p.colors))
  const allFonts = [...new Set(pages.flatMap(p => p.fonts))].filter(Boolean)
  const allCssVars = Object.assign({}, ...pages.map(p => p.cssVars))

  const lines: string[] = []
  lines.push('# Wix Design System — talroman.com')
  lines.push(`\nScraped: ${new Date().toISOString()}\n`)

  lines.push('## Pages\n')
  for (const p of pages) {
    lines.push(`- **${p.name}**: ${p.url}`)
  }

  lines.push('\n## Fonts\n')
  for (const f of allFonts) lines.push(`- ${f}`)

  lines.push('\n## Color Palette\n')
  lines.push('> Unique colors extracted from every element on every page\n')
  for (const c of allColors) lines.push(`- \`${c}\``)

  if (Object.keys(allCssVars).length > 0) {
    lines.push('\n## CSS Custom Properties (Wix theme vars)\n')
    lines.push('```css')
    lines.push(':root {')
    for (const [k, v] of Object.entries(allCssVars).slice(0, 60)) {
      lines.push(`  ${k}: ${v};`)
    }
    lines.push('}')
    lines.push('```')
  }

  lines.push('\n## Typography by Element\n')
  const firstPage = pages[0]
  if (firstPage) {
    for (const [label, styles] of Object.entries(firstPage.styles)) {
      lines.push(`\n### ${label}`)
      const typographyProps = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'text-align', 'direction']
      for (const prop of typographyProps) {
        const val = styles[prop]
        if (val) lines.push(`- **${prop}:** \`${val}\``)
      }
    }
  }

  lines.push('\n## Section Structure by Page\n')
  for (const p of pages) {
    if (p.sections.length === 0) continue
    lines.push(`\n### ${p.name} (${p.sections.length} sections)\n`)
    p.sections.slice(0, 20).forEach((sec, i) => {
      lines.push(`**Section ${i + 1}** — bg: \`${rgbToHex(sec.bg)}\`, h: ${sec.height}, padding: \`${sec.padding}\``)
      if (sec.text) lines.push(`> "${sec.text.slice(0, 100)}"`)
      lines.push('')
    })
  }

  lines.push('\n## Button / CTA Styles\n')
  const btnStyles = firstPage?.styles?.button
  if (btnStyles) {
    for (const [k, v] of Object.entries(btnStyles)) {
      lines.push(`- **${k}:** \`${v}\``)
    }
  }

  return lines.join('\n')
}

async function main() {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
  console.log('🚀 Wix style scraper — talroman.com\n')

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
    locale: 'he-IL',
  })
  const page = await context.newPage()

  // Discover real page URLs from the nav
  const discoveredPages = await discoverPages(page)

  const results = []
  for (const { name, url } of discoveredPages) {
    try {
      const data = await scrapePage(page, name, url)
      results.push(data)
    } catch (err) {
      console.warn(`  ⚠ Skipped ${name}: ${(err as Error).message.slice(0, 100)}`)
    }
  }

  await browser.close()

  // Write tokens JSON
  const tokensPath = path.join(OUT_DIR, 'design-tokens.json')
  fs.writeFileSync(tokensPath, JSON.stringify(results, null, 2))
  console.log(`\n✓ Tokens → ${tokensPath}`)

  // Write markdown report
  const report = buildReport(results)
  const reportPath = path.join(OUT_DIR, 'design-report.md')
  fs.writeFileSync(reportPath, report)
  console.log(`✓ Report → ${reportPath}`)

  console.log(`✓ Screenshots → ${SCREENSHOTS_DIR}/`)
  console.log('\n✅ Done! Share design-report.md here and we\'ll update your components.')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
