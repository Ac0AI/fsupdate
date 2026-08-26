#!/usr/bin/env node
// Genererar platshållarbilder till bloggen via NanoBanana (Gemini).
//
//   GEMINI_API_KEY=... node scripts/generate-blog-images.mjs                    # alla
//   GEMINI_API_KEY=... node scripts/generate-blog-images.mjs vad-tullen-fragar-efter
//
// Nyckeln läses ur miljön, aldrig ur koden. Ligger i .env.shared i Projekt-roten:
//   export GEMINI_API_KEY=$(grep '^GEMINI_API_KEY=' ../../.env.shared | cut -d= -f2-)
//
// Prompterna ligger i scripts/blog-image-prompts.json. Stilsuffixet är låst där
// och ska ändras på ett ställe, annars driftar bilderna isär.
//
// Bilderna är platshållare. De illustrerar ämnet, de bevisar ingenting, och de
// föreställer aldrig människor eller något som kan läsas som ett kundcase.

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'blog')

if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY saknas. Exportera den ur .env.shared innan du kör.')
  process.exit(1)
}

const { styleSuffix, aspect, images } = JSON.parse(readFileSync(join(root, 'scripts', 'blog-image-prompts.json'), 'utf8'))

const only = process.argv[2]
const queue = only ? images.filter((image) => image.slug === only) : images

if (!queue.length) {
  console.error(`Ingen bild matchar "${only}". Finns: ${images.map((image) => image.slug).join(', ')}`)
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })

const newestFile = (dir) =>
  readdirSync(dir)
    .map((file) => join(dir, file))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)[0]

let failed = 0

for (const image of queue) {
  const tmp = mkdtempSync(join(tmpdir(), 'fs-blog-img-'))
  const out = join(outDir, `${image.slug}.jpg`)
  console.log(`\n▸ ${image.slug}`)

  try {
    execFileSync('npx', ['-y', '@giorgioliapakis/nanobanana', 'generate', `${image.prompt} ${styleSuffix}`, '-o', tmp, '--aspect', aspect], {
      stdio: 'inherit',
    })

    const generated = newestFile(tmp)
    // Ner till webbstorlek. sips finns bara på macOS, faller tillbaka på en kopia.
    try {
      execFileSync('sips', ['-Z', '1600', '-s', 'format', 'jpeg', '-s', 'formatOptions', '82', generated, '--out', out], { stdio: 'ignore' })
    } catch {
      execFileSync('cp', [generated, out])
    }
    console.log(`  sparad ${out}`)
  } catch (error) {
    failed += 1
    console.error(`  misslyckades: ${error.message}`)
  } finally {
    rmSync(tmp, { recursive: true, force: true })
  }
}

console.log(failed ? `\nKlar, men ${failed} av ${queue.length} misslyckades.` : `\nKlar. ${queue.length} bilder.`)
