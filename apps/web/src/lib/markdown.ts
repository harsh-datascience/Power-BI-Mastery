import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeHighlight from 'rehype-highlight'
import rehypeStringify from 'rehype-stringify'
import { visit } from 'unist-util-visit'

const LEARN_BASE = 'https://learn.microsoft.com/en-us'

/**
 * Path prefixes that belong to Microsoft Learn, not to this portal.
 *
 * The source docs are written for learn.microsoft.com, so they contain
 * root-relative links like /power-bi/... and /dotnet/api/... Those 404
 * here. Link checking found 46 of them. We rewrite these to absolute
 * learn.microsoft.com URLs (opened in a new tab) instead of leaving
 * dead internal links.
 */
const EXTERNAL_PREFIXES = [
  '/power-bi/',
  '/power-query/',
  '/dotnet/',
  '/fabric/',
  '/ssms/',
  '/sql/',
  '/azure/',
  '/training/',
  '/office/',
  '/powerquery-m/',
  '/analysis-services/',
  '/power-platform/',
  '/purview/',
  '/graph/',
  '/rest/',
  '/dynamics365/',
  '/microsoftteams/',
  '/windows/',
  '/entra/',
  '/previous-versions/',
]

/**
 * Slugs this portal actually serves. Anything under /dax/ or /query/ in
 * the source is a sibling reference doc; map it onto our own routes when
 * we have the page, otherwise send it to Microsoft Learn.
 */
function rewriteHref(href: string, ownSlugs: Set<string>): { href: string; external: boolean } {
  if (!href.startsWith('/')) return { href, external: /^https?:/.test(href) }

  // Sibling DAX reference pages, e.g. /dax/earliest-function-dax
  if (href.startsWith('/dax/')) {
    const base = href.replace(/^\/dax\//, '').split('#')[0]!
    if (ownSlugs.has(`dax/best-practices/${base}`)) {
      return { href: `/docs/dax/best-practices/${base}`, external: false }
    }
    return { href: `${LEARN_BASE}${href}`, external: true }
  }

  // Sibling M reference pages, e.g. /powerquery-m/table-selectrows
  if (href.startsWith('/powerquery-m/')) {
    const base = href.replace(/^\/powerquery-m\//, '').split('#')[0]!
    if (ownSlugs.has(`m/${base}`)) {
      return { href: `/docs/m/${base}`, external: false }
    }
    return { href: `${LEARN_BASE}${href}`, external: true }
  }

  if (EXTERNAL_PREFIXES.some((p) => href.startsWith(p))) {
    return { href: `${LEARN_BASE}${href}`, external: true }
  }

  return { href, external: false }
}

/** rehype plugin: fix Microsoft Learn links so none of them are dead. */
function rehypeFixLearnLinks(ownSlugs: Set<string>) {
  return () => (tree: unknown) => {
    visit(tree as never, 'element', (node: {
      tagName?: string
      properties?: Record<string, unknown>
    }) => {
      if (node.tagName !== 'a') return
      const props = node.properties
      if (!props || typeof props['href'] !== 'string') return
      const { href, external } = rewriteHref(props['href'], ownSlugs)
      props['href'] = href
      if (external) {
        props['target'] = '_blank'
        props['rel'] = 'noopener noreferrer'
      }
    })
  }
}

/**
 * Render markdown to HTML using the unified pipeline.
 *
 * We deliberately do NOT use MDX here: the Microsoft source docs contain
 * raw HTML (<pre>, <b>) and unescaped braces that MDX rejects. A plain
 * markdown -> HTML pipeline handles all 788 files reliably.
 */
export async function renderMarkdown(
  markdown: string,
  ownSlugs: Set<string> = new Set()
): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeFixLearnLinks(ownSlugs))
    .use(rehypeHighlight, { detect: true, ignoreMissing: true } as never)
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown)

  return String(file)
}
