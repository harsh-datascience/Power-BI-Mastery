const http = require('http')

const BASE = 'http://localhost:3210'

const ROUTES = [
  { path: '/', expect: 200, contains: 'Power', label: 'Home page' },
  { path: '/docs', expect: 200, contains: 'Documentation', label: 'Docs index' },
  { path: '/docs/dax', expect: 200, contains: 'DAX', label: 'DAX index' },
  { path: '/docs/m', expect: 200, contains: 'M Language', label: 'M index' },
  { path: '/docs/m/table-selectrows', expect: 200, contains: 'Table.SelectRows', label: 'M function doc' },
  { path: '/docs/m/list-transform', expect: 200, contains: 'List.Transform', label: 'M List doc' },
  { path: '/docs/m/m-spec-let', expect: 200, contains: 'let', label: 'M spec doc' },
  { path: '/docs/dax/best-practices/dax-variables', expect: 200, contains: 'variable', label: 'DAX best practice' },
  { path: '/learn/paths', expect: 200, contains: 'Learning', label: 'Learning paths' },
  { path: '/playground', expect: 200, contains: 'Playground', label: 'Playground' },
  { path: '/api/health', expect: 200, contains: '"status":"ok"', label: 'Health endpoint' },
  { path: '/api/sitemap', expect: 200, contains: '<urlset', label: 'Sitemap XML' },
  { path: '/robots.txt', expect: 200, contains: 'User-agent', label: 'robots.txt' },
  { path: '/manifest.json', expect: 200, contains: 'Power BI Mastery', label: 'PWA manifest' },
  { path: '/this-page-does-not-exist', expect: 404, contains: '404', label: '404 handling' },
  { path: '/learn', expect: 307, contains: '', label: '/learn -> /learn/paths redirect' },
]

/**
 * Strip <script> blocks before substring matching.
 *
 * Next.js embeds the RSC flight payload in <script> tags, so a naive
 * body.includes() passes even if the visible HTML never rendered.
 * Matching only the non-script HTML proves real server-side rendering.
 */
function renderedHtml(raw) {
  return raw.replace(/<script[\s\S]*?<\/script>/g, '')
}

function get(path) {
  return new Promise((resolve) => {
    http.get(BASE + path, (res) => {
      let body = ''
      res.on('data', (c) => (body += c))
      res.on('end', () => resolve({ status: res.statusCode, body }))
    }).on('error', (e) => resolve({ status: 0, body: String(e) }))
  })
}

;(async () => {
  console.log('=== POWER BI MASTERY :: LIVE HTTP SMOKE TEST ===')
  console.log(`Server: ${BASE}\n`)

  let pass = 0
  let fail = 0

  for (const r of ROUTES) {
    const res = await get(r.path)
    const statusOk = res.status === r.expect

    // JSON/XML/text endpoints have no script payload to strip, and the
    // redirect case has no body to match.
    const isHtml = res.body.includes('<!DOCTYPE html') || res.body.includes('<html')
    const searchable = isHtml ? renderedHtml(res.body) : res.body
    const bodyOk = r.contains === '' ? true : searchable.includes(r.contains)

    if (statusOk && bodyOk) {
      console.log(`PASS  ${String(res.status).padEnd(4)} ${r.path.padEnd(42)} ${r.label}`)
      pass++
    } else {
      const why = !statusOk
        ? `expected ${r.expect}, got ${res.status}`
        : `body missing "${r.contains}"`
      console.log(`FAIL  ${String(res.status).padEnd(4)} ${r.path.padEnd(42)} ${r.label} (${why})`)
      fail++
    }
  }

  console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`)
  process.exit(fail > 0 ? 1 : 0)
})()
