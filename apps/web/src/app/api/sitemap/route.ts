import { getAllDocMeta } from '@/lib/content'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://powerbimastery.com'

const STATIC_ROUTES = [
  '/',
  '/docs',
  '/docs/dax',
  '/docs/m',
  '/learn/paths',
  '/playground',
  '/blog',
  '/about',
]

export function GET() {
  const docs = getAllDocMeta()

  const docUrls = docs.map(
    (doc) => `
  <url>
    <loc>${BASE}/docs/${doc.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
  )

  const staticUrls = STATIC_ROUTES.map(
    (route) => `
  <url>
    <loc>${BASE}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls.join('')}
${docUrls.join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  })
}
