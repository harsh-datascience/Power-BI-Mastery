import Link from 'next/link'
import { getDocByCategory } from '@/lib/content'
import { Clock, ArrowRight, Zap } from 'lucide-react'

export default function DaxDocsIndexPage() {
  const docs = getDocByCategory('dax')
  const bestPractices = docs.filter((d) => d.subcategory === 'best-practices')

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500/20">
          <Zap className="h-5 w-5 text-brand-500" />
        </div>
        <span className="badge-premium">DAX Reference</span>
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-3">DAX Documentation</h1>
      <p className="text-lg text-muted-foreground mb-10">
        Data Analysis Expressions (DAX) is the formula language used in Power BI, Analysis Services, and Power Pivot.
        Browse the complete reference including best practices, function guides, and query syntax.
      </p>

      <section className="mb-12">
        <h2 className="font-display text-2xl font-bold mb-5">Best Practices</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {bestPractices.map((doc) => (
            <Link
              key={doc.slug}
              href={`/docs/${doc.slug}`}
              className="flex items-start gap-3 rounded-lg border border-border p-4 hover:bg-muted hover:-translate-y-px transition-all"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-brand-500/10">
                <Zap className="h-3.5 w-3.5 text-brand-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{doc.title}</p>
                {doc.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{doc.description}</p>}
                <span className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />{doc.readingTime} min
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold mb-3">Quick Links</h2>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { label: 'Start Learning DAX', href: '/learn/paths' },
            { label: 'Advanced DAX Patterns', href: '/learn/paths' },
            { label: 'DAX Playground', href: '/playground' },
          ].map((l) => (
            // Two quick links point at /learn/paths, so href is not unique.
            <Link key={l.label} href={l.href}
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-muted-foreground border border-border hover:text-foreground hover:bg-muted transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />{l.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
