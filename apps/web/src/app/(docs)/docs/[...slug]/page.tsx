import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import { getAllDocMeta, getDocContent } from '@/lib/content'
import { DocBreadcrumb } from '@/components/docs/doc-breadcrumb'
import { DocMetaHeader } from '@/components/docs/doc-meta'
import { mdxComponents } from '@/components/docs/mdx-components'
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

  return (
    <article className="max-w-4xl">
      <DocBreadcrumb category={doc.category} subcategory={doc.subcategory} title={doc.title} />
      <DocMetaHeader
        title={doc.title}
        description={doc.description}
        category={doc.category}
        readingTime={doc.readingTime}
      />
      <div className="content-area mt-10">
        <MDXRemote
          source={doc.content}
          components={mdxComponents}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug, rehypeRaw],
            },
          }}
        />
      </div>
    </article>
  )
}
