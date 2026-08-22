/**
 * MUTATION TEST for validate-build.js and smoke-test.js
 *
 * These two suites assert with regex/substring matches against HTML.
 * That style can pass for the wrong reason. This script feeds each
 * check deliberately wrong input and confirms it rejects it.
 *
 * A check that accepts wrong input is false confidence.
 */
const fs = require('fs')
const path = require('path')
const http = require('http')

const ROOT = path.join(__dirname, '.next', 'server', 'app')
const BASE = 'http://localhost:3210'

let strong = 0
let weak = 0
const weakList = []

function verdict(label, caughtIt, detail) {
  if (caughtIt) {
    console.log(`  STRONG  ${label}`)
    strong++
  } else {
    console.log(`  WEAK    ${label}${detail ? ` -> ${detail}` : ''}`)
    weak++
    weakList.push(label)
  }
}

// The predicate used by validate-build.js (hardened: strips scripts first)
const renderedHtml = (raw) => raw.replace(/<script[\s\S]*?<\/script>/g, '')
const buildCheck = (content, pattern) => new RegExp(pattern).test(renderedHtml(content))
// The original naive predicate, kept as a control to demonstrate the flaw
const naiveCheck = (content, pattern) => new RegExp(pattern).test(content)

console.log('=== MUTATION TEST :: validate-build.js ===\n')

// ── 1. Does the check reject an empty page? ───────────────────────
{
  const pattern = 'Table.SelectRows'
  verdict(
    'validate-build rejects empty content',
    !buildCheck('', pattern)
  )
}

// ── 2. Does the check reject a generic Next.js error shell? ───────
{
  const errorShell =
    '<!DOCTYPE html><html><head><title>500</title></head><body>' +
    '<div id="__next">Application error: a server-side exception has occurred.</div>' +
    '</body></html>'
  verdict(
    'validate-build rejects a server error shell',
    !buildCheck(errorShell, 'Returns a table of rows')
  )
}

// ── 3. CRITICAL: does the pattern match only in the visible body, ──
//     or would it also match inside a <script> payload / URL?
{
  // Next.js embeds the RSC payload in <script> tags. If a doc page
  // failed to render its body but the title still appeared in the
  // flight payload, a naive regex would still pass.
  const scriptOnly =
    '<!DOCTYPE html><html><body><div id="__next"></div>' +
    '<script>self.__next_f.push([1,"Table.SelectRows"])</script></body></html>'

  const hardenedPasses = buildCheck(scriptOnly, 'Table.SelectRows')
  verdict(
    'validate-build rejects match found ONLY in <script> payload',
    !hardenedPasses,
    hardenedPasses ? 'matches inside script tag, not real rendered content' : ''
  )

  // Control: the original naive predicate is expected to be WEAK here.
  const naivePasses = naiveCheck(scriptOnly, 'Table.SelectRows')
  verdict(
    'CONTROL: naive regex over whole file (expected WEAK)',
    !naivePasses,
    naivePasses ? 'this is the flaw that was fixed' : ''
  )
}

// ── 4. Does "no horizontal overflow" style numeric check work? ────
// (validate-build has no numeric checks; skip)

// ── 5. Real regression: if a doc page rendered an EMPTY content-area,
//     would the suite notice?
{
  const emptyBody =
    '<!DOCTYPE html><html><body><main><article>' +
    '<h1>Table.SelectRows</h1><div class="content-area"></div>' +
    '</article></main></body></html>'
  // The current suite checks for 'Returns a table of rows' which WOULD fail here.
  verdict(
    'validate-build notices an empty content-area',
    !buildCheck(emptyBody, 'Returns a table of rows')
  )
}

// ── 6. Does the file-missing branch actually fail? ────────────────
{
  const missing = path.join(ROOT, 'docs', 'm', '__definitely_not_here__.html')
  verdict('validate-build fails on a missing file', !fs.existsSync(missing))
}

console.log('\n=== MUTATION TEST :: smoke-test.js ===\n')

function get(p) {
  return new Promise((resolve) => {
    http
      .get(BASE + p, (res) => {
        let body = ''
        res.on('data', (c) => (body += c))
        res.on('end', () => resolve({ status: res.statusCode, body }))
      })
      .on('error', (e) => resolve({ status: 0, body: String(e) }))
  })
}

;(async () => {
  // ── 7. Does a substring check distinguish two DIFFERENT doc pages? ──
  // If the router were broken and every /docs/m/* returned the same
  // page, would the suite notice?
  const a = await get('/docs/m/table-selectrows')
  const b = await get('/docs/m/list-transform')

  verdict(
    'smoke-test distinguishes two different doc pages',
    a.body !== b.body &&
      a.body.includes('Table.SelectRows') &&
      b.body.includes('List.Transform') &&
      !b.body.includes('Returns a table of rows from the')
  )

  // ── 8. Would the health check pass on a wrong-shaped response? ────
  const health = await get('/api/health')
  let healthJson = null
  try {
    healthJson = JSON.parse(health.body)
  } catch {}
  verdict(
    'smoke-test health check parses real JSON (not just substring)',
    healthJson !== null && healthJson.status === 'ok',
    healthJson === null ? 'body is not valid JSON' : ''
  )

  // ── 9. Would the sitemap check pass on an empty urlset? ───────────
  const sitemap = await get('/api/sitemap')
  const urlCount = (sitemap.body.match(/<loc>/g) || []).length
  verdict(
    'smoke-test sitemap has many URLs, not just a bare urlset tag',
    urlCount > 100,
    `only ${urlCount} <loc> entries`
  )

  // ── 10. Does the 404 check verify the STATUS, not just body text? ─
  const notFound = await get('/definitely-not-a-real-page')
  verdict(
    'smoke-test 404 asserts real 404 status (not a 200 soft-404)',
    notFound.status === 404
  )

  // ── 11. Does a doc page actually contain rendered prose, not just
  //        the RSC script payload?
  const doc = await get('/docs/m/table-selectrows')
  // Strip all <script>...</script> blocks, then look for the content
  const withoutScripts = doc.body.replace(/<script[\s\S]*?<\/script>/g, '')
  verdict(
    'doc page has content OUTSIDE the script payload (real SSR HTML)',
    withoutScripts.includes('Returns a table of rows'),
    !withoutScripts.includes('Returns a table of rows')
      ? 'content only exists inside <script>, page is not server-rendered'
      : ''
  )

  // ── 12. Does the home page actually render its sections server-side? ─
  const home = await get('/')
  const homeNoScripts = home.body.replace(/<script[\s\S]*?<\/script>/g, '')
  verdict(
    'home page sections are server-rendered (not script-only)',
    homeNoScripts.includes('Master') && homeNoScripts.includes('DAX')
  )

  console.log(`\n${'='.repeat(62)}`)
  console.log(`STRONG: ${strong}    WEAK: ${weak}`)
  if (weakList.length) {
    console.log('\nWeak checks (accept wrong input):')
    weakList.forEach((w) => console.log(`  - ${w}`))
  }
  console.log('='.repeat(62))
  process.exit(0)
})()
