/**
 * Rasterise public/icon.svg into the PNG sizes referenced by
 * public/manifest.json and layout.tsx. Run with: node scripts/gen-icons.mjs
 *
 * Uses the Playwright Chromium that already ships as a dev dependency, so
 * this adds no new tooling.
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pub = path.join(root, 'public')
const svg = fs.readFileSync(path.join(pub, 'icon.svg'), 'utf8')

const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

const browser = await chromium.launch()
fs.mkdirSync(path.join(pub, 'icons'), { recursive: true })

async function render(size, outFile) {
  const page = await browser.newPage({
    viewport: { width: size, height: size },
    deviceScaleFactor: 1,
  })
  await page.setContent(
    `<body style="margin:0">${svg.replace('<svg', `<svg width="${size}" height="${size}"`)}</body>`
  )
  await page.screenshot({ path: outFile, omitBackground: true })
  await page.close()
  console.log('wrote', path.relative(root, outFile))
}

for (const s of SIZES) {
  await render(s, path.join(pub, 'icons', `icon-${s}.png`))
}
// Apple touch icon is a fixed 180x180.
await render(180, path.join(pub, 'apple-touch-icon.png'))
// favicon.ico: browsers accept PNG data in a .ico container, but a plain
// 32x32 PNG named .ico is not valid. Emit favicon.png and let the ICO be
// built from the 32px raster below.
await render(32, path.join(pub, 'favicon-32.png'))

await browser.close()

// Minimal ICO writer: single 32x32 PNG-compressed image entry.
const png = fs.readFileSync(path.join(pub, 'favicon-32.png'))
const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0) // reserved
header.writeUInt16LE(1, 2) // type: icon
header.writeUInt16LE(1, 4) // image count
const entry = Buffer.alloc(16)
entry[0] = 32 // width
entry[1] = 32 // height
entry[2] = 0 // palette
entry[3] = 0 // reserved
entry.writeUInt16LE(1, 4) // colour planes
entry.writeUInt16LE(32, 6) // bits per pixel
entry.writeUInt32LE(png.length, 8)
entry.writeUInt32LE(header.length + entry.length, 12)
fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([header, entry, png]))
fs.unlinkSync(path.join(pub, 'favicon-32.png'))
console.log('wrote public/favicon.ico')
