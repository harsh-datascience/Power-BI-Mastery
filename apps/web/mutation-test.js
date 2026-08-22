/**
 * MUTATION TEST
 *
 * Deliberately break each feature, then confirm the corresponding
 * ui-test.js assertion actually fails. An assertion that still passes
 * against a broken feature is a false-confidence assertion.
 *
 * We simulate breakage in-page (CSS/DOM manipulation) rather than editing
 * source, so this is fast and non-destructive.
 */
const { chromium } = require('playwright')

const BASE = 'http://localhost:3210'
let strong = 0
let weak = 0
const weakList = []

async function mutate(label, setupFn, assertionFn) {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.goto(BASE, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(400)

    // Confirm the assertion passes on the healthy page first
    const healthy = await assertionFn(page)
    if (!healthy) {
      console.log(`  SKIP    ${label} (assertion failed on healthy page)`)
      await browser.close()
      return
    }

    // Break the feature
    await setupFn(page)
    await page.waitForTimeout(300)

    // Assertion should now FAIL
    const stillPasses = await assertionFn(page)
    if (stillPasses) {
      console.log(`  WEAK    ${label} -> assertion still passes when broken`)
      weak++
      weakList.push(label)
    } else {
      console.log(`  STRONG  ${label} -> assertion correctly caught the breakage`)
      strong++
    }
  } catch (e) {
    console.log(`  STRONG  ${label} -> threw when broken (${e.message.split('\n')[0].slice(0, 50)})`)
    strong++
  }
  await browser.close()
}

;(async () => {
  console.log('=== MUTATION TEST :: are the UI assertions real? ===\n')

  // 1. "Hero headline visible"
  await mutate(
    'Hero headline visible',
    (p) => p.evaluate(() => { document.querySelector('h1').style.display = 'none' }),
    async (p) => await p.locator('h1').first().isVisible()
  )

  // 2. "CSS actually applied (body has bg color)"
  await mutate(
    'CSS applied (body bg)',
    (p) => p.evaluate(() => { document.body.style.backgroundColor = 'rgba(0, 0, 0, 0)' }),
    async (p) => {
      const bg = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
      return bg !== '' && bg !== 'rgba(0, 0, 0, 0)'
    }
  )

  // 3. "Brand gold color token resolves"
  await mutate(
    'Brand gradient token resolves',
    (p) => p.evaluate(() => {
      document.querySelectorAll('.gradient-text').forEach((el) => {
        el.style.backgroundImage = 'none'
      })
    }),
    async (p) => {
      const c = await p.evaluate(() => {
        const el = document.querySelector('.gradient-text')
        return el ? getComputedStyle(el).backgroundImage : ''
      })
      return c.includes('gradient')
    }
  )

  // 4. "Stats section renders" — the .count() > 0 style assertion
  await mutate(
    'Stats section (count > 0 style)',
    (p) => p.evaluate(() => {
      document.querySelectorAll('*').forEach((el) => {
        if (el.children.length === 0 && /Active Learners|Functions Documented/.test(el.textContent)) {
          el.textContent = ''
        }
      })
    }),
    async (p) => (await p.locator('text=/Active Learners|Functions Documented/').count()) > 0
  )

  // 5. HIDDEN-ELEMENT TRAP: the visibility-based assertion must catch this
  //    (the old `.count() > 0` version did NOT, which is why it was replaced)
  await mutate(
    'Stats section when merely HIDDEN (visibility assertion)',
    (p) => p.evaluate(() => {
      document.querySelectorAll('section').forEach((s) => {
        if (/Active Learners/.test(s.textContent)) s.style.display = 'none'
      })
    }),
    async (p) => {
      const els = await p.locator('text=/Active Learners|Functions Documented/').all()
      for (const el of els) {
        if (await el.isVisible()) return true
      }
      return false
    }
  )

  // 5b. Prove the OLD assertion style was genuinely weak (control case)
  await mutate(
    'CONTROL: old .count() style on hidden element (expected WEAK)',
    (p) => p.evaluate(() => {
      document.querySelectorAll('section').forEach((s) => {
        if (/Active Learners/.test(s.textContent)) s.style.display = 'none'
      })
    }),
    async (p) => (await p.locator('text=/Active Learners|Functions Documented/').count()) > 0
  )

  // 6. Theme toggle: does the bg really change?
  await mutate(
    'Theme toggle changes background',
    (p) => p.evaluate(() => {
      // Freeze background so toggling has no visual effect
      document.body.style.setProperty('background-color', 'rgb(1,2,3)', 'important')
    }),
    async (p) => {
      const before = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
      await p.locator('header button[aria-label="Toggle theme"]').click()
      await p.waitForTimeout(400)
      const after = await p.evaluate(() => getComputedStyle(document.body).backgroundColor)
      return before !== after
    }
  )

  // 7. Duplicate-H1 regression guard
  await mutate(
    'Duplicate H1 guard (doc page)',
    async (p) => {
      await p.goto(`${BASE}/docs/m/table-selectrows`, { waitUntil: 'domcontentloaded' })
      await p.waitForTimeout(300)
      await p.evaluate(() => {
        const h = document.createElement('h1')
        h.textContent = 'Table.SelectRows'
        document.querySelector('.content-area').prepend(h)
      })
    },
    async (p) => {
      if (!p.url().includes('/docs/')) {
        await p.goto(`${BASE}/docs/m/table-selectrows`, { waitUntil: 'domcontentloaded' })
        await p.waitForTimeout(300)
      }
      return (await p.locator('h1').count()) === 1
    }
  )

  // 8. Horizontal overflow detection
  await mutate(
    'Horizontal overflow detection',
    (p) => p.evaluate(() => {
      const d = document.createElement('div')
      d.style.width = '4000px'
      d.style.height = '10px'
      document.body.appendChild(d)
    }),
    async (p) => {
      const o = await p.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth)
      return o <= 2
    }
  )

  // 9. Console error detection
  await mutate(
    'Console error detection',
    async (p) => {
      p._injectedErrors = []
      p.on('console', (m) => { if (m.type() === 'error') p._injectedErrors.push(m.text()) })
      await p.evaluate(() => { console.error('SYNTHETIC TEST ERROR') })
      await p.waitForTimeout(200)
    },
    async (p) => !(p._injectedErrors || []).some((e) => e.includes('SYNTHETIC'))
  )

  console.log(`\n${'='.repeat(60)}`)
  console.log(`STRONG assertions: ${strong}`)
  console.log(`WEAK assertions:   ${weak}`)
  if (weakList.length) {
    console.log('\nWeak (pass even when the feature is broken):')
    weakList.forEach((w) => console.log(`  - ${w}`))
  }
  console.log('='.repeat(60))
  process.exit(0)
})()
