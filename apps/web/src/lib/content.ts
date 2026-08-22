import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ROOT resolves from apps/web/ → ../../query-languages
const ROOT = path.join(process.cwd(), '..', '..', 'query-languages')

export interface DocMeta {
  slug: string
  title: string
  description: string
  category: 'dax' | 'm'
  subcategory: string
  filePath: string
  readingTime: number
}

export interface DocContent extends DocMeta {
  content: string
  headings: { id: string; text: string; level: number }[]
}

function readingTime(text: string) {
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 200))
}

/**
 * Parse frontmatter defensively.
 *
 * Some Microsoft source docs contain malformed YAML (e.g. duplicate
 * `ms.topic` keys in dax/includes/*.md), which makes gray-matter throw.
 * When that happens we fall back to stripping the frontmatter block
 * manually and returning empty metadata, so a single bad file cannot
 * break the entire build.
 */
function safeMatter(raw: string): { data: Record<string, unknown>; content: string } {
  try {
    const parsed = matter(raw)
    return { data: parsed.data as Record<string, unknown>, content: parsed.content }
  } catch {
    // Strip a leading --- ... --- block if present
    const stripped = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
    return { data: {}, content: stripped }
  }
}

function extractHeadings(content: string) {
  const lines = content.split('\n')
  const headings: { id: string; text: string; level: number }[] = []
  for (const line of lines) {
    const match = line.match(/^(#{1,4})\s+(.+)$/)
    if (match) {
      const level = match[1]!.length
      const text = match[2]!.trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
      headings.push({ id, text, level })
    }
  }
  return headings
}

function inferTitle(slug: string, frontmatter: Record<string, unknown>): string {
  if (typeof frontmatter['title'] === 'string') return frontmatter['title']
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('.')
    .replace(/\.([a-z])/g, (_, c: string) => '.' + c.toUpperCase())
}

export function getAllDocMeta(): DocMeta[] {
  const docs: DocMeta[] = []

  // Process M docs — slug = "m/table-selectrows" → URL /docs/m/table-selectrows
  const mDir = path.join(ROOT, 'm')
  if (fs.existsSync(mDir)) {
    for (const file of fs.readdirSync(mDir)) {
      if (!file.endsWith('.md') || file === 'toc.yml' || file === 'docfx.json') continue
      const filePath = path.join(mDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = safeMatter(raw)
      const base = path.basename(file, '.md')
      const slug = `m/${base}` // e.g. "m/table-selectrows"
      docs.push({
        slug,
        title: inferTitle(base, data),
        description: typeof data['description'] === 'string' ? data['description'] : '',
        category: 'm',
        subcategory: 'functions',
        filePath,
        readingTime: readingTime(content),
      })
    }
  }

  // Process DAX best-practices docs — slug = "dax/best-practices/dax-variables"
  const daxBpDir = path.join(ROOT, 'dax', 'best-practices')
  if (fs.existsSync(daxBpDir)) {
    for (const file of fs.readdirSync(daxBpDir)) {
      if (!file.endsWith('.md')) continue
      const filePath = path.join(daxBpDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = safeMatter(raw)
      const base = path.basename(file, '.md')
      const slug = `dax/best-practices/${base}`
      docs.push({
        slug,
        title: inferTitle(base, data),
        description: typeof data['description'] === 'string' ? data['description'] : '',
        category: 'dax',
        subcategory: 'best-practices',
        filePath,
        readingTime: readingTime(content),
      })
    }
  }

  // Process DAX includes docs
  const daxInclDir = path.join(ROOT, 'dax', 'includes')
  if (fs.existsSync(daxInclDir)) {
    for (const file of fs.readdirSync(daxInclDir)) {
      if (!file.endsWith('.md')) continue
      const filePath = path.join(daxInclDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = safeMatter(raw)
      const base = path.basename(file, '.md')
      const slug = `dax/includes/${base}`
      docs.push({
        slug,
        title: inferTitle(base, data),
        description: typeof data['description'] === 'string' ? data['description'] : '',
        category: 'dax',
        subcategory: 'includes',
        filePath,
        readingTime: readingTime(content),
      })
    }
  }

  return docs
}

/**
 * Remove the first top-level `# Heading` from the markdown body.
 *
 * The page shell already renders the document title in DocMetaHeader,
 * so leaving the source H1 in place renders the title twice. We only
 * strip a leading H1 that appears before any other content.
 */
function stripLeadingH1(markdown: string): string {
  const lines = markdown.split('\n')
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim()
    if (line === '') continue
    if (/^#\s+\S/.test(line)) {
      // Drop this line and any blank lines immediately after it
      let j = i + 1
      while (j < lines.length && lines[j]!.trim() === '') j++
      return [...lines.slice(0, i), ...lines.slice(j)].join('\n')
    }
    // First non-empty line is not an H1, leave the content untouched
    return markdown
  }
  return markdown
}

export function getDocContent(slug: string): DocContent | null {
  const all = getAllDocMeta()
  const meta = all.find((d) => d.slug === slug)
  if (!meta) return null

  const raw = fs.readFileSync(meta.filePath, 'utf-8')
  const { content: rawContent } = safeMatter(raw)
  const content = stripLeadingH1(rawContent)
  const headings = extractHeadings(content)

  return { ...meta, content, headings }
}

export function getDocByCategory(category: 'dax' | 'm'): DocMeta[] {
  return getAllDocMeta().filter((d) => d.category === category)
}
