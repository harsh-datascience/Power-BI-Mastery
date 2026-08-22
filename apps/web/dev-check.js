const http = require('http')

const BASE = process.env.BASE || 'http://localhost:3000'
const paths = [
  '/',
  '/docs',
  '/docs/dax',
  '/docs/m',
  '/docs/m/table-selectrows',
  '/docs/dax/best-practices/dax-variables',
  '/playground',
  '/learn/paths',
  '/api/health',
]

function get(p, timeoutMs = 60000) {
  return new Promise((resolve) => {
    const t0 = Date.now()
    const req = http.get(BASE + p, (r) => {
      let b = ''
      r.on('data', (c) => (b += c))
      r.on('end', () => resolve({ status: r.statusCode, body: b, ms: Date.now() - t0 }))
    })
    req.on('error', (e) => resolve({ status: 0, body: e.code || String(e), ms: Date.now() - t0 }))
    req.setTimeout(timeoutMs, () => {
      req.destroy()
      resolve({ status: -1, body: 'TIMEOUT', ms: Date.now() - t0 })
    })
  })
}

;(async () => {
  console.log(`=== pnpm dev acceptance check :: ${BASE} ===\n`)
  let ok = 0
  let bad = 0
  for (const p of paths) {
    const r = await get(p)
    const good = r.status === 200
    if (good) ok++
    else bad++
    console.log(
      `${good ? 'PASS' : 'FAIL'}  ${String(r.status).padEnd(4)} ${p.padEnd(42)} ${r.ms}ms`
    )
    if (!good) console.log(`        -> ${String(r.body).slice(0, 120)}`)
  }
  console.log(`\nRESULT: ${ok} passed, ${bad} failed`)
  process.exit(bad > 0 ? 1 : 0)
})()
