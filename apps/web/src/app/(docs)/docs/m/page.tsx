import Link from 'next/link'
import { getDocByCategory } from '@/lib/content'
import { Clock, ArrowRight, RotateCcw } from 'lucide-react'

export default function MDocsIndexPage() {
  const docs = getDocByCategory('m')

  // Group by first letter of title for A-Z browsing
  const grouped = docs
    .sort((a, b) => a.title.localeCompare(b.title))
    .reduce<Record<string, typeof docs>>((acc, doc) => {
      const letter = (doc.title[0] ?? '#').toUpperCase()
      if (!acc[letter]) acc[letter] = []
      acc[letter]!.push(doc)
      return acc
    }, {})

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-500/20">
          <RotateCcw className="h-5 w-5 text-navy-400" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border border-navy-500/30 bg-navy-500/10 text-navy-400">M Language</span>
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-3">M Language Reference</h1>
      <p className="text-lg text-muted-foreground mb-4">
        Power Query M is the formula language in Power Query. It is a functional language optimized for building queries.
        This reference covers all {docs.length}+ documented functions.
      </p>

      <div className="flex flex-wrap gap-2 mb-10">
        {Object.keys(grouped).sort().map((letter) => (
          <a key={letter} href={`#letter-${letter}`}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-border text-xs font-mono hover:bg-muted hover:text-foreground text-muted-foreground transition-colors">
            {letter}
          </a>
        ))}
      </div>

      {Object.keys(grouped).sort().map((letter) => (
        <section key={letter} id={`letter-${letter}`} className="mb-8 scroll-mt-20">
          <h2 className="font-display text-xl font-bold mb-3 text-navy-400">{letter}</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {grouped[letter]!.map((doc) => (
              <Link
                key={doc.slug}
                href={`/docs/${doc.slug}`}
                className="group flex items-center justify-between rounded-lg border border-border px-4 py-2.5 hover:bg-muted hover:-translate-y-px transition-all"
              >
                <div>
                  <p className="text-sm font-mono font-medium">{doc.title}</p>
                  {doc.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{doc.description}</p>
                  )}
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
