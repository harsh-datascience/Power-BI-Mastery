import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { ArrowRight, Clock, BookOpen, Trophy, ChevronRight } from 'lucide-react'

const PATHS = [
  {
    id: 'dax-fundamentals', category: 'DAX', level: 'Beginner', hours: 8, modules: 12,
    title: 'DAX Fundamentals',
    description: 'Learn measures, calculated columns, filter context, and the most essential DAX functions used in every Power BI project.',
    color: 'from-brand-500 to-amber-400', border: 'border-brand-500/25', bg: 'from-brand-500/10 to-amber-400/5',
    topics: ['Measures vs Columns', 'Filter Context', 'CALCULATE', 'RELATED', 'Time Intelligence', 'DAX Variables'],
    href: '/learn/dax-fundamentals',
  },
  {
    id: 'dax-advanced', category: 'DAX', level: 'Advanced', hours: 14, modules: 18,
    title: 'Advanced DAX Patterns',
    description: 'Master evaluation context, iterators, ranking, semi-additive measures, DAX Studio, and enterprise performance patterns.',
    color: 'from-orange-500 to-red-400', border: 'border-orange-500/25', bg: 'from-orange-500/10 to-red-400/5',
    topics: ['Row Context', 'SUMX / AVERAGEX', 'RANKX', 'Many-to-many', 'DAX Studio', 'Performance'],
    href: '/learn/advanced-dax',
  },
  {
    id: 'm-basics', category: 'M', level: 'Beginner', hours: 10, modules: 14,
    title: 'M Language Basics',
    description: 'Start with Power Query M from the ground up. Let expressions, data types, common transforms, and error handling.',
    color: 'from-navy-600 to-navy-400', border: 'border-navy-500/25', bg: 'from-navy-600/10 to-navy-400/5',
    topics: ['Let / In', 'Tables, Lists, Records', 'Text Functions', 'Date Functions', 'Error Handling', 'Connectors'],
    href: '/learn/m-basics',
  },
  {
    id: 'm-advanced', category: 'M', level: 'Advanced', hours: 16, modules: 20,
    title: 'Advanced Power Query',
    description: 'Custom functions, query folding, parameterized queries, M type system, custom connectors, and performance optimization.',
    color: 'from-indigo-500 to-purple-400', border: 'border-indigo-500/25', bg: 'from-indigo-500/10 to-purple-400/5',
    topics: ['Custom Functions', 'Query Folding', 'M Type System', 'Parameterized Queries', 'Web API', 'Custom Connectors'],
    href: '/learn/advanced-m',
  },
  {
    id: 'dax-best-practices', category: 'DAX', level: 'Intermediate', hours: 4, modules: 11,
    title: 'DAX Best Practices',
    description: 'The curated best-practice guides from the official documentation: FILTER, BLANK, DIVIDE, SELECTEDVALUE, and more.',
    color: 'from-emerald-500 to-teal-400', border: 'border-emerald-500/25', bg: 'from-emerald-500/10 to-teal-400/5',
    topics: ['Avoid FILTER', 'Handle BLANK', 'DIVIDE vs /', 'SELECTEDVALUE', 'Variables', 'UDFs'],
    href: '/docs/dax/best-practices/dax-variables',
  },
]

const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10',
  Intermediate: 'text-yellow-400 bg-yellow-500/10',
  Advanced: 'text-orange-400 bg-orange-500/10',
}

export default function LearningPathsPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container py-16">
          {/* Hero */}
          <div className="mb-14 text-center">
            <div className="badge-premium mx-auto mb-4">Guided Learning</div>
            <h1 className="font-display text-5xl font-bold tracking-tight mb-4">
              Learning <span className="gradient-text">Paths</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Structured journeys from beginner to expert, built from the official Power BI documentation.
              Follow a path, track your progress, and earn a certificate.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-14">
            {[
              { label: 'Total Hours', value: '52+' },
              { label: 'Modules', value: '75+' },
              { label: 'Topics', value: '30+' },
              { label: 'Certificates', value: '5' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Paths grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {PATHS.map((path) => (
              <Link
                key={path.id}
                href={path.href}
                className={`group flex flex-col gap-5 rounded-2xl border ${path.border} bg-gradient-to-br ${path.bg} p-8 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        path.category === 'DAX'
                          ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                          : 'bg-navy-500/15 text-navy-400 border border-navy-500/30'
                      }`}>{path.category}</span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR[path.level]}`}>
                        {path.level}
                      </span>
                    </div>
                    <h2 className="font-display text-2xl font-bold">{path.title}</h2>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all mt-1 shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{path.description}</p>
                <div className="flex flex-wrap gap-2">
                  {path.topics.map((t) => (
                    <span key={t} className="rounded-md bg-background/60 border border-border/50 px-2.5 py-1 text-xs font-mono text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-5 pt-3 border-t border-border/40">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />{path.hours} hours
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />{path.modules} modules
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-xs font-semibold">
                    <Trophy className="h-3.5 w-3.5 text-brand-400" /> Certificate
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
