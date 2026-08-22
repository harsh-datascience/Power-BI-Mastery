import { describe, it, expect } from 'vitest'
import { getAllDocMeta, getDocContent, getDocByCategory } from './content'

/**
 * Unit tests for the content pipeline.
 *
 * These guard the behaviours that a full rebuild would otherwise be the
 * only way to catch: slug shape, malformed-YAML resilience, and the
 * duplicate-H1 fix.
 */

describe('getAllDocMeta', () => {
  const docs = getAllDocMeta()

  it('discovers a substantial number of source docs', () => {
    expect(docs.length).toBeGreaterThan(700)
  })

  it('prefixes every M slug with "m/"', () => {
    const mDocs = docs.filter((d) => d.category === 'm')
    expect(mDocs.length).toBeGreaterThan(500)
    expect(mDocs.every((d) => d.slug.startsWith('m/'))).toBe(true)
  })

  it('prefixes DAX best-practice slugs correctly', () => {
    const bp = docs.filter((d) => d.subcategory === 'best-practices')
    expect(bp.length).toBeGreaterThan(5)
    expect(bp.every((d) => d.slug.startsWith('dax/best-practices/'))).toBe(true)
  })

  it('produces unique slugs (no route collisions)', () => {
    const slugs = docs.map((d) => d.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('never emits an empty title', () => {
    expect(docs.every((d) => d.title.trim().length > 0)).toBe(true)
  })

  it('computes a positive reading time for every doc', () => {
    expect(docs.every((d) => d.readingTime >= 1)).toBe(true)
  })

  it('excludes non-markdown files such as docfx.json and toc.yml', () => {
    // Note: "m/table-tocolumns" legitimately contains the letters "toc",
    // so match on the actual excluded filenames rather than a substring.
    expect(docs.some((d) => d.slug.endsWith('/docfx'))).toBe(false)
    expect(docs.some((d) => d.slug.endsWith('/toc'))).toBe(false)
    expect(docs.every((d) => d.filePath.endsWith('.md'))).toBe(true)
  })
})

describe('getDocContent', () => {
  it('loads a known M function doc', () => {
    const doc = getDocContent('m/table-selectrows')
    expect(doc).not.toBeNull()
    expect(doc!.title).toBe('Table.SelectRows')
    expect(doc!.content).toContain('Returns a table of rows')
  })

  it('strips the leading H1 so the title is not rendered twice', () => {
    const doc = getDocContent('m/table-selectrows')
    expect(doc).not.toBeNull()
    // The page shell renders the title; the body must not repeat it as H1
    const firstLine = doc!.content.split('\n').find((l) => l.trim() !== '')
    expect(firstLine?.startsWith('# ')).toBe(false)
  })

  it('keeps inner headings intact after stripping the H1', () => {
    const doc = getDocContent('m/table-selectrows')
    expect(doc!.content).toMatch(/^##\s+Syntax/m)
  })

  it('survives malformed YAML frontmatter (duplicate ms.topic key)', () => {
    // dax/includes contains files with duplicate YAML keys that make
    // gray-matter throw. safeMatter() must fall back rather than crash.
    const includes = getAllDocMeta().filter((d) => d.subcategory === 'includes')
    expect(includes.length).toBeGreaterThan(0)
    for (const meta of includes) {
      expect(() => getDocContent(meta.slug)).not.toThrow()
    }
  })

  it('returns null for an unknown slug', () => {
    expect(getDocContent('m/definitely-not-a-real-doc')).toBeNull()
  })

  it('extracts headings with ids for the table of contents', () => {
    const doc = getDocContent('m/table-selectrows')
    expect(doc!.headings.length).toBeGreaterThan(0)
    expect(doc!.headings.every((h) => h.id.length > 0)).toBe(true)
    expect(doc!.headings.some((h) => h.text === 'Syntax')).toBe(true)
  })

  it('extracts headings even when the source uses CRLF line endings', () => {
    // Windows checkouts store these files with \r\n. A trailing \r made
    // the heading regex `$` anchor fail, so every doc silently reported
    // zero headings. This guards that regression.
    const withHeadings = getAllDocMeta()
      .slice(0, 40)
      .map((m) => getDocContent(m.slug))
      .filter((d) => d && d.headings.length > 0)
    expect(withHeadings.length).toBeGreaterThan(20)
  })
})

describe('getDocByCategory', () => {
  it('separates DAX and M docs', () => {
    const dax = getDocByCategory('dax')
    const m = getDocByCategory('m')
    expect(dax.every((d) => d.category === 'dax')).toBe(true)
    expect(m.every((d) => d.category === 'm')).toBe(true)
    expect(dax.length + m.length).toBe(getAllDocMeta().length)
  })
})
