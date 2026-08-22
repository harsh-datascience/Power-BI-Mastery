const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '.next', 'server', 'app')
let pass = 0
let fail = 0

/**
 * Strip <script> blocks before matching.
 *
 * Next.js embeds the React Server Component flight payload inside
 * <script> tags. A naive regex over the whole file therefore passes
 * even when the visible HTML is empty, because the text still appears
 * in that payload. Mutation testing confirmed this was a real hole:
 * a page with an empty body but a populated flight payload passed.
 *
 * Matching only the non-script HTML proves the page is genuinely
 * server-rendered.
 */
function renderedHtml(raw) {
  return raw.replace(/<script[\s\S]*?<\/script>/g, '')
}

function check(relPath, pattern, label) {
  const full = path.join(ROOT, relPath)
  if (!fs.existsSync(full)) {
    console.log(`FAIL: ${label} (file missing: ${relPath})`)
    fail++
    return
  }
  const content = renderedHtml(fs.readFileSync(full, 'utf-8'))
  if (new RegExp(pattern).test(content)) {
    console.log(`PASS: ${label}`)
    pass++
  } else {
    console.log(`FAIL: ${label} (pattern not found in rendered HTML: ${pattern})`)
    fail++
  }
}

function countHtml(dir) {
  let n = 0
  const walk = (d) => {
    if (!fs.existsSync(d)) return
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (e.isDirectory()) walk(path.join(d, e.name))
      else if (e.name.endsWith('.html')) n++
    }
  }
  walk(dir)
  return n
}

console.log('=== POWER BI MASTERY :: ACCEPTANCE VALIDATION ===\n')
console.log(`Total doc pages generated: ${countHtml(path.join(ROOT, 'docs'))}\n`)

console.log('--- Core pages ---')
check('index.html', 'Power', 'Home page renders with brand')
check('index.html', 'Master', 'Home hero headline present')
check('index.html', 'Learning Paths|Learning', 'Home learning paths section')
check('index.html', 'CALCULATE', 'Home code showcase has DAX')
check('_not-found.html', '404', '404 page renders')
check('playground.html', 'Code Playground', 'Playground page renders')
check('playground.html', 'CALCULATE', 'Playground DAX template present')
check('playground.html', 'M Language', 'Playground M language tab present')
check('learn/paths.html', 'Learning', 'Learning paths page renders')
check('learn/paths.html', 'DAX Fundamentals', 'Learning path cards present')

console.log('\n--- Docs index pages ---')
check('docs.html', 'Documentation', '/docs index renders')
check('docs/dax.html', 'DAX Documentation', '/docs/dax index renders')
check('docs/dax.html', 'variables|COUNTROWS|SELECTEDVALUE', '/docs/dax lists real best-practices')
check('docs/m.html', 'M Language Reference', '/docs/m index renders')
check('docs/m.html', 'Table\\.|List\\.|Text\\.', '/docs/m lists real M functions')

console.log('\n--- Real content pages (from source markdown) ---')
check('docs/m/table-selectrows.html', 'Table.SelectRows', 'M doc: Table.SelectRows title')
check('docs/m/table-selectrows.html', 'Returns a table of rows', 'M doc: real body content')
check('docs/m/table-selectrows.html', 'CustomerID', 'M doc: code example content')
check('docs/m/list-transform.html', 'List.Transform', 'M doc: List.Transform')
check('docs/m/m-spec-let.html', 'let|Let', 'M spec: let expression doc')
check('docs/dax/best-practices/dax-variables.html', 'variable', 'DAX doc: variables best practice')
check('docs/dax/best-practices/dax-countrows.html', 'COUNTROWS', 'DAX doc: COUNTROWS best practice')

console.log('\n--- Rendering features ---')
check('docs/m/table-selectrows.html', '<pre', 'Code blocks rendered as <pre>')
check('docs/m/table-selectrows.html', 'min read', 'Reading time computed')
check('docs/m/table-selectrows.html', 'content-area', 'Prose wrapper class applied')
check('docs/m/table-selectrows.html', 'id="syntax"|id="about"|id="example', 'Heading anchors (rehype-slug)')
check('docs/m/table-functions.html', '<table|<a href', 'Tables/links rendered (remark-gfm)')

console.log(`\n=== RESULT: ${pass} passed, ${fail} failed ===`)
process.exit(fail > 0 ? 1 : 0)
