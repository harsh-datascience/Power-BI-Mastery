import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

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
  // Convert file slug to title: "table-selectrows" => "Table.SelectRows"
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('.')
    .replace(/\.([a-z])/g, (_, c: string) => '.' + c.toUpperCase())
}

function slugFromFile(filePath: string, category: 'dax' | 'm', subDir?: string): string {
  const base = path.basename(filePath, '.md')
  return subDir ? `${category}/${subDir}/${base}` : `${category}/${base}`
}

export function getAllDocMeta(): DocMeta[] {
  const docs: DocMeta[] = []

  // Process M docs
  const mDir = path.join(ROOT, 'm')
  if (fs.existsSync(mDir)) {
    for (const file of fs.readdirSync(mDir)) {
      if (!file.endsWith('.md') || file === 'toc.yml') continue
      const filePath = path.join(mDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const slug = path.basename(file, '.md')
      docs.push({
        slug,
        title: inferTitle(slug, data),
        description: typeof data['description'] === 'string' ? data['description'] : '',
        category: 'm',
        subcategory: 'functions',
        filePath,
        readingTime: readingTime(content),
      })
    }
  }

  // Process DAX best-practices docs
  const daxBpDir = path.join(ROOT, 'dax', 'best-practices')
  if (fs.existsSync(daxBpDir)) {
    for (const file of fs.readdirSync(daxBpDir)) {
      if (!file.endsWith('.md')) continue
      const filePath = path.join(daxBpDir, file)
      const raw = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const slug = path.basename(file, '.md')
      docs.push({
        slug,
        title: inferTitle(slug, data),
        description: typeof data['description'] === 'string' ? data['description'] : '',
        category: 'dax',
        subcategory: 'best-practices',
        filePath,
        readingTime: readingTime(content),
      })
    }
  }

  return docs
}

export function getDocContent(slug: string): DocContent | null {
  const all = getAllDocMeta()
  const meta = all.find((d) => d.slug === slug)
  if (!meta) return null

  const raw = fs.readFileSync(meta.filePath, 'utf-8')
  const { content } = matter(raw)
  const headings = extractHeadings(content)

  return { ...meta, content, headings }
}

export function getDocByCategory(category: 'dax' | 'm'): DocMeta[] {
  return getAllDocMeta().filter((d) => d.category === category)
}
