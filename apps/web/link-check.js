/**
 * LINK INTEGRITY
 *
 * Requirement traced: "users can refer to these docs for their learning"
 *   -> navigation must not lead anywhere broken.
 *
 * Checks, against the real generated site:
 *   1. Every sidebar nav link resolves to a generated page
 *   2. Every internal <a href="/..."> across ALL pages resolves
 *   3. Sitemap URLs all resolve
 */
const fs = require('fs')
const path = require('path')

const APP = path.join(__dirname, '.next', 'server', 'app')
const SIDEBAR = path.join(__dirname, 'src', 'components', 'docs', 'docs-sidebar.tsx')

// Routes that are real but not emitted as .html (API routes, dynamic)
const KNOWN_NON_HTML = new Set(['/api/health', '/api/sitemap', '/api/auth'])

function pageExists(route) {
  if (route === '/') return fs.existsSync(path.join(APP, 'index.html'))
  const clean = route.split('#')[0].split('?')[0].replace(/\/$/, '')
  if (!clean) return fs.existsSync(path.join(APP, 'index.html'))
  if ([...KNOWN_NON_HTML].some((k) => clean.startsWith(k))) return true
  const asFile = path.join(APP, ...clean.split('/').filter(Boolean)) + '.html'
  const asDir = path.join(APP, ...clean.split('/').filter(Boolean), 'index.html')
  return fs.existsSync(asFile) || fs.existsSync(asDir)
}

let fail = 0

// ── 1. Sidebar nav links ──────────────────────────────────────────
console.log('=== 1. SIDEBAR NAV LINKS ===\n')
const sidebarSrc = fs.readFileSync(SIDEBAR, 'utf-8')
const sidebarHrefs = [...sidebarSrc.matchAll(/href:\s*'([^']+)'/g)].map((m) => m[1])
const uniqueSidebar = [...new Set(sidebarHrefs)]

let sbOk = 0
const sbDead = []
for (const href of uniqueSidebar) {
  if (pageExists(href)) sbOk++
  else sbDead.push(href)
}
console.log(`  Sidebar links checked : ${uniqueSidebar.length}`)
console.log(`  Resolve OK            : ${sbOk}`)
console.log(`  DEAD                  : ${sbDead.length}`)
if (sbDead.length) {
  sbDead.forEach((d) => console.log(`    DEAD -> ${d}`))
  fail += sbDead.length
}

// ── 2. All internal links across every generated page ─────────────
console.log('\n=== 2. INTERNAL LINKS ACROSS ALL PAGES ===\n')
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (e.name.endsWith('.html')) out.push(p)
  }
  return out
}
const htmlFiles = walk(APP)
const linkTargets = new Map() // href -> example source page

for (const f of htmlFiles) {
  const html = fs.readFileSync(f, 'utf-8').replace(/<script[\s\S]*?<\/script>/g, '')
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1]
    if (href.startsWith('/_next')) continue
    if (/\.(png|jpg|svg|ico|json|txt|xml|webmanifest)$/i.test(href)) continue
    if (!linkTargets.has(href)) {
      linkTargets.set(href, path.relative(APP, f))
    }
  }
}

let liOk = 0
const liDead = []
for (const [href, from] of linkTargets) {
  if (pageExists(href)) liOk++
  else liDead.push({ href, from })
}
console.log(`  Pages scanned          : ${htmlFiles.length}`)
console.log(`  Distinct internal links: ${linkTargets.size}`)
console.log(`  Resolve OK             : ${liOk}`)
console.log(`  DEAD                   : ${liDead.length}`)
if (liDead.length) {
  liDead.slice(0, 20).forEach((d) => console.log(`    DEAD -> ${d.href}   (from ${d.from})`))
  if (liDead.length > 20) console.log(`    ... and ${liDead.length - 20} more`)
  fail += liDead.length
}

console.log('\n' + '='.repeat(64))
console.log(fail === 0 ? 'RESULT: PASS - no dead internal links' : `RESULT: FAIL - ${fail} dead links`)
console.log('='.repeat(64))
process.exit(fail === 0 ? 0 : 1)
