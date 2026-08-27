import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { GET } from './route'

/**
 * The sitemap is hand-maintained, so it can drift away from the routes the
 * app actually builds. It previously advertised /blog and /about, neither of
 * which has a page, which makes crawlers see soft 404s on every crawl.
 *
 * These tests check the emitted XML against the real app directory, so adding
 * a route to STATIC_ROUTES without shipping the page fails the build.
 */

const APP_DIR = path.join(process.cwd(), 'src', 'app')

/** Does a route like `/learn/paths` have a real page.tsx behind it? */
function routeHasPage(route: string): boolean {
  const segments = route.split('/').filter(Boolean)

  // Route groups such as (docs) and (home) are invisible in the URL, so a
  // route can live at any depth of group nesting. Walk the tree and try
  // matching the segments while allowing (group) directories to be skipped.
  function walk(dir: string, remaining: string[]): boolean {
    if (remaining.length === 0) {
      return ['page.tsx', 'page.ts', 'page.jsx', 'page.js', 'route.ts'].some((f) =>
        fs.existsSync(path.join(dir, f))
      )
    }
    const [head, ...tail] = remaining
    const direct = path.join(dir, head as string)
    if (fs.existsSync(direct) && walk(direct, tail)) return true

    // Descend through route groups, e.g. src/app/(docs)/docs
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      if (!entry.name.startsWith('(')) continue
      if (walk(path.join(dir, entry.name), remaining)) return true
    }
    return false
  }

  return walk(APP_DIR, segments)
}

function locsFrom(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] as string)
}

describe('sitemap route', () => {
  it('lists only static routes that have a real page', async () => {
    const xml = await GET().text()
    const base = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://powerbimastery.com'

    const staticPaths = locsFrom(xml)
      .map((loc) => loc.replace(base, ''))
      .filter((p) => !p.startsWith('/docs/dax/') && !p.startsWith('/docs/m/'))

    expect(staticPaths.length).toBeGreaterThan(0)

    const missing = staticPaths.filter((p) => !routeHasPage(p))
    expect(missing).toEqual([])
  })

  it('does not advertise the unbuilt /blog and /about routes', async () => {
    const xml = await GET().text()
    expect(xml).not.toContain('/blog')
    expect(xml).not.toContain('/about')
  })

  it('includes doc pages and the home page', async () => {
    const xml = await GET().text()
    const locs = locsFrom(xml)
    expect(locs.some((l) => l.endsWith('/'))).toBe(true)
    expect(locs.some((l) => l.includes('/docs/m/'))).toBe(true)
  })

  it('serves XML content type', () => {
    expect(GET().headers.get('content-type')).toBe('application/xml')
  })
})
