import { notFound } from 'next/navigation'
import { getAllDocMeta, getDocContent } from '@/lib/content'
import { renderMarkdown } from '@/lib/markdown'
import { DocBreadcrumb } from '@/components/docs/doc-breadcrumb'
import { DocMetaHeader } from '@/components/docs/doc-meta'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string[] }
}

export async function generateStaticParams() {
  const allDocs = getAllDocMeta()
  return allDocs.map((doc) => ({ slug: doc.slug.split('/') }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = params.slug.join('/')
  const doc = getDocContent(slug)
  if (!doc) return { title: 'Not Found' }
  return {
    title: doc.title,
    description: doc.description,
    openGraph: { title: doc.title, description: doc.description },
  }
}

export default async function DocPage({ params }: Props) {
  const slug = params.slug.join('/')
  const doc = getDocContent(slug)
  if (!doc) notFound()

  // Pass the set of slugs this portal serves so cross-doc links can be
  // rewritten to our own routes, and Microsoft Learn links to absolute URLs.
  const ownSlugs = new Set(getAllDocMeta().map((d) => d.slug))
  const html = await renderMarkdown(doc.content, ownSlugs)

  return (
    <article className="max-w-4xl">
      <DocBreadcrumb category={doc.category} subcategory={doc.subcategory} />
      <DocMetaHeader
        title={doc.title}
        description={doc.description}
        category={doc.category}
        readingTime={doc.readingTime}
      />
      <div
        className="content-area mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  )
}
