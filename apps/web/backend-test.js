const http = require('http')

const BASE = process.env.BASE || 'http://localhost:3000'

function get(path) {
  return new Promise((resolve) => {
    http.get(BASE + path, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }))
    }).on('error', (err) => resolve({ status: 0, error: err.message }))
  })
}

;(async () => {
  console.log('=== BACKEND API INTEGRATION TEST ===\n')
  let fail = 0

  // 1. Health check structure
  console.log('--- 1. GET /api/health ---')
  const health = await get('/api/health')
  if (health.status !== 200) {
    console.log(`FAIL: Expected 200, got ${health.status}`)
    fail++
  } else {
    try {
      const data = JSON.parse(health.body)
      const keys = ['status', 'service', 'version', 'timestamp', 'env']
      const missing = keys.filter((k) => !(k in data))
      if (missing.length) {
        console.log(`FAIL: Health JSON missing keys: ${missing.join(', ')}`)
        fail++
      } else if (data.status !== 'ok') {
        console.log(`FAIL: Health status is not "ok": ${data.status}`)
        fail++
      } else {
        console.log(`PASS: Health API returned status="ok" (env=${data.env}, version=${data.version})`)
      }
    } catch (e) {
      console.log(`FAIL: Response is not valid JSON: ${e.message}`)
      fail++
    }
  }

  // 2. Sitemap structure & count
  console.log('\n--- 2. GET /api/sitemap ---')
  const sitemap = await get('/api/sitemap')
  if (sitemap.status !== 200) {
    console.log(`FAIL: Expected 200, got ${sitemap.status}`)
    fail++
  } else if (!sitemap.headers['content-type']?.includes('xml')) {
    console.log(`FAIL: Expected Content-Type xml, got ${sitemap.headers['content-type']}`)
    fail++
  } else {
    const locCount = (sitemap.body.match(/<loc>/g) || []).length
    if (locCount < 700) {
      console.log(`FAIL: Sitemap contains only ${locCount} URLs (expected >700)`)
      fail++
    } else {
      console.log(`PASS: Sitemap returned valid XML containing ${locCount} URLs`)
    }
  }

  // 3. NextAuth Providers API Endpoint
  console.log('\n--- 3. GET /api/auth/providers ---')
  const providers = await get('/api/auth/providers')
  if (providers.status !== 200) {
    console.log(`FAIL: Expected 200, got ${providers.status}`)
    fail++
  } else {
    try {
      const data = JSON.parse(providers.body)
      if (data.github && data.google && data['azure-ad']) {
        console.log('PASS: NextAuth providers endpoint configured with github, google, azure-ad')
      } else {
        console.log(`FAIL: Missing provider in NextAuth response: ${Object.keys(data).join(', ')}`)
        fail++
      }
    } catch (e) {
      console.log(`FAIL: Providers response is not valid JSON: ${e.message}`)
      fail++
    }
  }

  // 4. NextAuth CSRF Token Endpoint
  console.log('\n--- 4. GET /api/auth/csrf ---')
  const csrf = await get('/api/auth/csrf')
  if (csrf.status !== 200) {
    console.log(`FAIL: Expected 200, got ${csrf.status}`)
    fail++
  } else {
    try {
      const data = JSON.parse(csrf.body)
      if (data.csrfToken) {
        console.log('PASS: NextAuth CSRF endpoint issued token successfully')
      } else {
        console.log('FAIL: CSRF response missing csrfToken property')
        fail++
      }
    } catch (e) {
      console.log(`FAIL: CSRF response is not valid JSON: ${e.message}`)
      fail++
    }
  }

  console.log('\n' + '='.repeat(60))
  console.log(fail === 0 ? 'RESULT: PASS - All backend API endpoints verified' : `RESULT: FAIL - ${fail} failure(s)`)
  console.log('='.repeat(60))
  process.exit(fail === 0 ? 0 : 1)
})()
