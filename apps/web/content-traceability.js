/**
 * CONTENT TRACEABILITY
 *
 * Previous checks sampled about six documents. That does not prove the
 * pipeline works for all of them. This maps EVERY source markdown file
 * to its generated page and asserts the rendered HTML actually contains
 * text taken from that specific source file.
 *
 * Requirement traced: "users can refer to these docs for their learning"
 *   -> every source doc must be reachable AND display its own content.
 */
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', '..', 'query-languages')
const OUT = path.join(__dirname, '.next', 'server', 'app', 'docs')

const renderedHtml = (raw) => raw.replace(/<script[\s\S]*?<\/script>/g, '')

function decodeEntities(s) {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
}

function stripTags(html) {
  return decodeEntities(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ')
}

/** Pull a distinctive prose sentence out of the source markdown. */
function probeFromSource(md) {
  const body = md
    .replace(/^---[\s\S]*?---\r?\n/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, '') // fenced code
    .replace(/<pre[\s\S]*?<\/pre>/g, '') // html pre
    .replace(/<[^>]*>/g, ' ') // inline html tags (br, sub, b, ...)
    .replace(/^#.*$/gm, '') // headings
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[*_`|>-]/g, ' ')
    .replace(/&\w+;/g, ' ')

  const sentences = body
    .split(/[.\n]/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(
      (s) =>
        s.length >= 25 &&
        s.length <= 110 &&
        /^[A-Za-z]/.test(s) &&
        // Reject leftover markup or grammar-notation fragments; these are
        // not prose and cannot be matched reliably against rendered text.
        !/[<>{}\/\\]/.test(s) &&
        // Require it to read like a sentence: several ordinary words
        (s.match(/\b[a-z]{3,}\b/g) || []).length >= 4
    )

  return sentences[0] || null
}

const sources = []
function collect(dir, category, subdir) {
  if (!fs.existsSync(dir)) return
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    const base = path.basename(f, '.md')
    const slug = subdir ? `${category}/${subdir}/${base}` : `${category}/${base}`
    sources.push({ file: path.join(dir, f), slug })
  }
}
collect(path.join(SRC, 'm'), 'm')
collect(path.join(SRC, 'dax', 'best-practices'), 'dax', 'best-practices')
collect(path.join(SRC, 'dax', 'includes'), 'dax', 'includes')

console.log('=== CONTENT TRACEABILITY :: every source doc -> rendered page ===\n')
console.log(`Source markdown files discovered: ${sources.length}\n`)

let pageExists = 0
let pageMissing = 0
let contentMatched = 0
let contentUnmatched = 0
let noProbe = 0
const missingPages = []
const unmatched = []

for (const s of sources) {
  const htmlPath = path.join(OUT, ...s.slug.split('/')) + '.html'

  if (!fs.existsSync(htmlPath)) {
    pageMissing++
    missingPages.push(s.slug)
    continue
  }
  pageExists++

  const md = fs.readFileSync(s.file, 'utf-8')
  const probe = probeFromSource(md)
  if (!probe) {
    noProbe++
    continue
  }

  const rendered = stripTags(renderedHtml(fs.readFileSync(htmlPath, 'utf-8')))
  // Compare on a normalised, punctuation-insensitive basis
  const norm = (x) => x.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
  if (norm(rendered).includes(norm(probe))) {
    contentMatched++
  } else {
    contentUnmatched++
    if (unmatched.length < 12) unmatched.push({ slug: s.slug, probe: probe.slice(0, 70) })
  }
}

console.log('--- 1. Reachability: does every source doc have a page? ---')
console.log(`  Pages generated : ${pageExists}`)
console.log(`  Pages MISSING   : ${pageMissing}`)
if (missingPages.length) {
  console.log('  Missing slugs (first 15):')
  missingPages.slice(0, 15).forEach((m) => console.log(`    - ${m}`))
}

console.log('\n--- 2. Fidelity: does each page show ITS OWN source text? ---')
console.log(`  Content matched   : ${contentMatched}`)
console.log(`  Content UNMATCHED : ${contentUnmatched}`)
console.log(`  No prose probe    : ${noProbe} (code/table-only docs, skipped)`)
if (unmatched.length) {
  console.log('  Unmatched samples:')
  unmatched.forEach((u) => console.log(`    - ${u.slug}\n        probe: "${u.probe}"`))
}

const checked = contentMatched + contentUnmatched
const rate = checked ? ((contentMatched / checked) * 100).toFixed(1) : '0'
console.log(`\n  Fidelity rate: ${rate}% of ${checked} probed docs`)

console.log('\n' + '='.repeat(64))
const ok = pageMissing === 0 && contentUnmatched === 0
console.log(ok ? 'RESULT: PASS - all source docs reachable and rendering own content' : 'RESULT: FAIL')
console.log('='.repeat(64))
process.exit(ok ? 0 : 1)
