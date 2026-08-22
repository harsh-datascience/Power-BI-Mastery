'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, BookOpen, ChevronRight } from 'lucide-react'

const PATHS = [
  {
    id: 'dax-fundamentals',
    category: 'DAX',
    title: 'DAX Fundamentals',
    description: 'Start your DAX journey. Learn measures, calculated columns, filter context, and the most essential functions.',
    level: 'Beginner',
    hours: 8,
    modules: 12,
    color: 'from-brand-500 to-amber-400',
    bg: 'from-brand-500/10 to-amber-400/5',
    border: 'border-brand-500/25',
    topics: ['Measures vs Columns', 'CALCULATE', 'FILTER', 'Time Intelligence'],
    href: '/learn/paths',
  },
  {
    id: 'dax-advanced',
    category: 'DAX',
    title: 'Advanced DAX Patterns',
    description: 'Deep dive into evaluation context, iterator functions, advanced patterns, and performance optimization.',
    level: 'Advanced',
    hours: 14,
    modules: 18,
    color: 'from-orange-500 to-red-400',
    bg: 'from-orange-500/10 to-red-400/5',
    border: 'border-orange-500/25',
    topics: ['Row Context', 'SUMX/AVERAGEX', 'RANKX', 'Variables'],
    href: '/learn/paths',
  },
  {
    id: 'm-basics',
    category: 'M',
    title: 'M Language Basics',
    description: 'Learn Power Query M from the ground up — let expressions, data types, tables, lists, records, and common transforms.',
    level: 'Beginner',
    hours: 10,
    modules: 14,
    color: 'from-navy-600 to-navy-400',
    bg: 'from-navy-600/10 to-navy-400/5',
    border: 'border-navy-500/25',
    topics: ['Let Expressions', 'Tables & Lists', 'Text Functions', 'Error Handling'],
    href: '/learn/paths',
  },
  {
    id: 'm-advanced',
    category: 'M',
    title: 'Advanced Power Query',
    description: 'Custom connectors, query folding, parameterized queries, function composition, and the M type system.',
    level: 'Advanced',
    hours: 16,
    modules: 20,
    color: 'from-indigo-500 to-purple-400',
    bg: 'from-indigo-500/10 to-purple-400/5',
    border: 'border-indigo-500/25',
    topics: ['Custom Functions', 'Query Folding', 'Connectors', 'M Type System'],
    href: '/learn/paths',
  },
]

const LEVEL_COLOR: Record<string, string> = {
  Beginner: 'text-emerald-400 bg-emerald-500/10',
  Intermediate: 'text-yellow-400 bg-yellow-500/10',
  Advanced: 'text-orange-400 bg-orange-500/10',
  Expert: 'text-red-400 bg-red-500/10',
}

export function LearningPathsSection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/20">
      <div className="container">
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <div className="badge-premium mb-4">Guided Learning</div>
            <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
              Learning <span className="gradient-text">Paths</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg">
              Follow structured journeys crafted by Power BI experts. Track your progress and earn certificates.
            </p>
          </div>
          <Link
            href="/learn/paths"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
          >
            View all paths <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {PATHS.map((path, i) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                href={path.href}
                className={`group flex flex-col gap-5 rounded-2xl border ${path.border} bg-gradient-to-br ${path.bg} p-7 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        path.category === 'DAX' 
                          ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
                          : 'bg-navy-500/15 text-navy-400 border border-navy-500/30'
                      }`}>
                        {path.category}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_COLOR[path.level]}`}>
                        {path.level}
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-bold">{path.title}</h3>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{path.description}</p>

                {/* Topics */}
                <div className="flex flex-wrap gap-2">
                  {path.topics.map((t) => (
                    <span key={t} className="rounded-md bg-background/60 border border-border/50 px-2.5 py-1 text-xs font-mono text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>

                {/* Meta */}
                <div className="flex items-center gap-5 pt-2 border-t border-border/40">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{path.hours} hours</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>{path.modules} modules</span>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-semibold bg-gradient-to-r ${path.color} bg-clip-text text-transparent`}>
                      Start Learning →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
