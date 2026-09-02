#!/usr/bin/env node
// Skärmdumpar till designkritiken (se DESIGN-KRITIK.md).
// Användning: node scripts/design-kritik-shots.mjs https://fsupdate-nn98.vercel.app ./kritik-shots [landing|movehelp|all]
// Mobil 390 (fold + hel sida) och desktop 1280 av startsidan och flytthjälpsflödets tre steg.
// Playwright finns i hubbens node_modules (Projekt/), fall tillbaka dit om den saknas lokalt.

const { chromium } = await import('playwright').catch(() => import('../../../node_modules/playwright/index.mjs'))
import { mkdirSync } from 'node:fs'

const [base = 'https://fsupdate-nn98.vercel.app', out = './kritik-shots', which = 'all'] = process.argv.slice(2)
mkdirSync(out, { recursive: true })
const browser = await chromium.launch()

const VIEWPORTS = [
  { tag: 'mobil', width: 390, height: 844, mobile: true },
  { tag: 'desktop', width: 1280, height: 800, mobile: false },
]

async function open(vp) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.mobile, hasTouch: vp.mobile, deviceScaleFactor: 2, locale: 'sv-SE' })
  const page = await context.newPage()
  return { context, page }
}
async function goto(page, path) {
  await page.goto(base + path, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => page.goto(base + path, { waitUntil: 'load', timeout: 45000 }))
  await page.waitForTimeout(2500) // hero-intoning och strömmad Suspense-data
}
async function shot(page, name) {
  await page.screenshot({ path: `${out}/${name}-fold.png` })
  // I helsidesbilder hamnar en sticky bottenlist annars mitt i bilden (den ritas där
  // viewporten slutade). Släpp den till sin plats i flödet just för helsidan.
  await page.addStyleTag({ content: '.sticky{position:static!important}' })
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true })
  await page.evaluate(() => document.querySelectorAll('style').forEach((el) => el.textContent?.includes('.sticky{position:static!important}') && el.remove()))
  console.log('  ✓', name)
}

for (const vp of VIEWPORTS) {
  if (which === 'all' || which === 'landing') {
    const { context, page } = await open(vp)
    await goto(page, '/')
    await shot(page, `landing-${vp.tag}`)
    await context.close()
  }
  if (which === 'all' || which === 'movehelp') {
    // Läge med öppnad följdfråga, i egen sida så det inte påverkar det rena flödet.
    if (vp.mobile) {
      const { context, page } = await open(vp)
      await goto(page, '/demo/movehelp')
      await page.getByRole('button', { name: 'Fortsätt till sista steget', exact: true }).click()
      await page.waitForTimeout(1200)
      await page.getByRole('button', { name: 'Ja, berätta', exact: true }).first().click()
      await page.waitForTimeout(600)
      await page.screenshot({ path: `${out}/movehelp-steg2-${vp.tag}-tungt-oppet-full.png`, fullPage: true })
      console.log('  ✓', `movehelp-steg2-${vp.tag}-tungt-oppet`)
      await context.close()
    }
    const { context, page } = await open(vp)
    await goto(page, '/demo/movehelp')
    await shot(page, `movehelp-steg1-${vp.tag}`)
    await page.getByRole('button', { name: 'Fortsätt till sista steget', exact: true }).click()
    await page.waitForTimeout(1200)
    await shot(page, `movehelp-steg2-${vp.tag}`)
    await page.getByRole('button', { name: 'Begär offert', exact: true }).click()
    await page.waitForTimeout(2500)
    const h1 = await page.locator('h1').first().innerText().catch(() => '?')
    if (!/på väg/i.test(h1)) console.log('  ⚠ steg 3 nåddes inte, h1:', h1)
    await shot(page, `movehelp-steg3-${vp.tag}`)
    await context.close()
  }
}
await browser.close()
console.log(`\nKlart: ${out}`)
