import { describe, it, expect } from 'vitest'
import { renderMarkdown } from './markdown'

/**
 * Unit tests for the markdown rendering pipeline.
 *
 * These lock in the behaviours that were discovered the hard way during
 * a full build: raw HTML support, GFM tables, heading ids, and the
 * Microsoft Learn link rewriting that removed 46 dead links.
 */

describe('renderMarkdown', () => {
  it('renders basic markdown to HTML', async () => {
    const html = await renderMarkdown('## Syntax\n\nSome text.')
    expect(html).toContain('<h2')
    expect(html).toContain('Some text.')
  })

  it('adds id attributes to headings for TOC anchors', async () => {
    const html = await renderMarkdown('## About This\n')
    expect(html).toMatch(/<h2[^>]*id="about-this"/)
  })

  it('preserves raw HTML that MDX would have rejected', async () => {
    // The M docs use <pre> and <b> inline; MDX failed on these.
    const html = await renderMarkdown('<pre>Table.SelectRows(<b>table</b>)</pre>')
    expect(html).toContain('<pre>')
    expect(html).toContain('<b>')
  })

  it('renders GFM tables', async () => {
    const md = ['| A | B |', '| - | - |', '| 1 | 2 |'].join('\n')
    const html = await renderMarkdown(md)
    expect(html).toContain('<table>')
    expect(html).toContain('<td>')
  })

  it('does not throw on unescaped braces', async () => {
    // MDX treats { } as expressions and failed; markdown must not.
    await expect(renderMarkdown('Use {CustomerID = 1} here.')).resolves.toContain('CustomerID')
  })

  it('rewrites Microsoft Learn root-relative links to absolute URLs', async () => {
    const html = await renderMarkdown('[docs](/power-bi/visuals/power-bi-data-points)')
    expect(html).toContain('https://learn.microsoft.com/en-us/power-bi/visuals/power-bi-data-points')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noopener noreferrer"')
  })

  it('rewrites /power-query/ links too', async () => {
    const html = await renderMarkdown('[t](/power-query/data-types)')
    expect(html).toContain('https://learn.microsoft.com/en-us/power-query/data-types')
  })

  it('maps a sibling doc link onto our own route when we serve it', async () => {
    const own = new Set(['m/table-selectrows'])
    const html = await renderMarkdown('[x](/powerquery-m/table-selectrows)', own)
    expect(html).toContain('href="/docs/m/table-selectrows"')
    expect(html).not.toContain('target="_blank"')
  })

  it('sends a sibling link to Learn when we do not serve that page', async () => {
    const html = await renderMarkdown('[x](/powerquery-m/not-hosted-here)', new Set())
    expect(html).toContain('https://learn.microsoft.com/en-us/powerquery-m/not-hosted-here')
  })

  it('leaves genuinely external links alone', async () => {
    const html = await renderMarkdown('[g](https://example.com/page)')
    expect(html).toContain('https://example.com/page')
  })

  it('leaves in-page anchors alone', async () => {
    const html = await renderMarkdown('[s](#syntax)')
    expect(html).toContain('href="#syntax"')
  })
})
