import { chromium } from 'playwright'
import * as path from 'path'
import * as fs from 'fs'

const args = process.argv.slice(2)
const url = args[0] || 'http://localhost:3000'
const outputName = args[1] || 'screenshot'
const viewport = args[2] || 'desktop' // desktop, mobile, or WxH
const scrollY = parseInt(args[3] || '0', 10) // optional scroll position

async function takeScreenshot() {
  const browser = await chromium.launch()

  let width = 1440
  let height = 900

  if (viewport === 'mobile') {
    width = 390
    height = 844
  } else if (viewport.includes('x')) {
    const [w, h] = viewport.split('x').map(Number)
    width = w || 1440
    height = h || 900
  }

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 2,
  })

  const page = await context.newPage()

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })

    // Wait for content to render and animations to start
    await page.waitForTimeout(2000)

    // Scroll if specified
    if (scrollY > 0) {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY)
      await page.waitForTimeout(300)
    }

    const screenshotDir = path.join(process.cwd(), '.screenshots')
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true })
    }

    const filename = `${outputName}-${viewport}-${Date.now()}.png`
    const filepath = path.join(screenshotDir, filename)

    await page.screenshot({ path: filepath, fullPage: false })

    console.log(`Screenshot saved: ${filepath}`)
    console.log(`Viewport: ${width}x${height}`)
    console.log(`URL: ${url}`)

  } catch (error) {
    console.error('Error taking screenshot:', error)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

takeScreenshot()
