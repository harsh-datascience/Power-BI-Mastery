import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'

/**
 * Render markdown to HTML using the unified pipeline.
 *
 * We deliberately do NOT use MDX here: the Microsoft source docs contain
 * raw HTML (<pre>, <b>) and unescaped braces that MDX rejects. A plain
 * markdown -> HTML pipeline handles all 800+ files reliably.
 *
 * Pipeline:
 *   remark-parse    parse markdown
 *   remark-gfm      GitHub tables, strikethrough, task lists, autolinks
 *   remark-rehype   markdown AST -> HTML AST (allowDangerousHtml keeps raw HTML)
 *   rehype-raw      re-parse the raw HTML into real nodes
 *   rehype-slug     add id attributes to headings (for the TOC anchors)
 *   rehype-highlight syntax highlighting for fenced code blocks
 *   rehype-stringify serialize to an HTML string
 */
export async function renderMarkdown(markdown: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, { detect: true, ignoreMissing: true } as never)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(file)
}
