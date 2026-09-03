// Skärmdump av telefonmockupen i heron till designkritiken (se docs/kritik/2026-09-03-slutbild.md).
// Användning: node scripts/kritik-shot-phone.mjs ut.png [bas-url]
const { chromium } = await import('playwright').catch(() => import('../../../node_modules/playwright/index.mjs'))
const [out, base = 'http://localhost:3000/sv'] = process.argv.slice(2)
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2, reducedMotion: 'reduce', locale: 'sv-SE' })
const page = await ctx.newPage()
await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => page.goto(base, { waitUntil: 'load', timeout: 90000 }))
await page.waitForSelector('[data-hero-phone]', { timeout: 60000 })
await page.waitForTimeout(3000)
const box = await page.locator('[data-hero-phone]').boundingBox()
const m = 48
await page.screenshot({ path: out, clip: { x: box.x - m, y: box.y - m, width: box.width + 2 * m, height: box.height + 2 * m } })
await browser.close()
console.log('ok', out)
