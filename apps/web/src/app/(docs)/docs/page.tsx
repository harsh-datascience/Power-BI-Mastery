import Link from 'next/link'
import { ArrowRight, BookOpen, Zap, RotateCcw } from 'lucide-react'

export default function DocsIndexPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight mb-4">
          Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Complete reference for DAX and Power Query M Language. Browse by category or use the search to find any function.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Link
          href="/docs/dax"
          className="group flex flex-col gap-4 rounded-xl border border-brand-500/25 bg-gradient-to-br from-brand-500/10 to-amber-400/5 p-7 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/20">
            <Zap className="h-5 w-5 text-brand-500" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-1.5">DAX Reference</h2>
            <p className="text-sm text-muted-foreground">300+ functions — aggregation, filter, time intelligence, statistical, text, and more.</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-brand-500 mt-auto">
            Browse DAX <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/docs/m"
          className="group flex flex-col gap-4 rounded-xl border border-navy-500/25 bg-gradient-to-br from-navy-600/10 to-navy-400/5 p-7 hover:-translate-y-0.5 hover:shadow-card-hover transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-500/20">
            <RotateCcw className="h-5 w-5 text-navy-400" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold mb-1.5">M Language Reference</h2>
            <p className="text-sm text-muted-foreground">500+ functions — tables, lists, records, text, dates, connectors, and the full language spec.</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-medium text-navy-400 mt-auto">
            Browse M <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="mt-10 rounded-xl border border-border bg-muted/40 p-6">
        <h3 className="font-semibold mb-2">Quick Links</h3>
        <div className="grid sm:grid-cols-2 gap-2">
          {[
            { label: 'DAX Best Practices', href: '/docs/dax' },
            { label: 'CALCULATE Function', href: '/docs/dax/best-practices/dax-variables' },
            { label: 'M Language Specification', href: '/docs/m/m-spec-introduction' },
            { label: 'Table Functions Reference', href: '/docs/m/table-functions' },
            { label: 'Time Intelligence Guide', href: '/docs/dax' },
            { label: 'Data Connector Reference', href: '/docs/m/sql-database' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
