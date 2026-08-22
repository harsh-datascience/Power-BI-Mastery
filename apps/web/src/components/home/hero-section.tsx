'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Code2, Play, Sparkles, ChevronRight, Star } from 'lucide-react'

const BADGE_TEXT = 'Enterprise Learning Portal'
const FLOATING_TAGS = ['CALCULATE', 'FILTER', 'Table.Group', 'List.Transform', 'SUMX', 'Text.Split']

const CODE_SNIPPET_DAX = `/* Total Revenue with YTD */
Total Revenue YTD = 
  CALCULATE(
    [Total Revenue],
    DATESYTD('Date'[Date])
  )`

const CODE_SNIPPET_M = `// Merge & clean customer data
let
  Source   = Sql.Database("server", "db"),
  Orders   = Source{[Name="Orders"]}[Data],
  Filtered = Table.SelectRows(
    Orders, each [Status] = "Active"
  )
in
  Filtered`

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[92dvh] flex items-center">
      {/* Animated mesh background */}
      <div className="absolute inset-0 animated-bg" />
      <div className="absolute inset-0 hero-pattern" />

      {/* Glow orbs */}
      <div className="hero-glow hero-glow-gold absolute -top-32 -left-32" />
      <div className="hero-glow hero-glow-navy absolute -bottom-32 -right-32" />
      <div className="hero-glow hero-glow-gold absolute top-1/2 left-1/2 -translate-x-1/2 opacity-[0.06]" />

      {/* Floating code tags */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_TAGS.map((tag, i) => (
          <motion.div
            key={tag}
            className="absolute text-xs font-mono px-2.5 py-1 rounded-full border border-brand-500/20 bg-brand-500/5 text-brand-400/60 backdrop-blur-sm"
            style={{
              left: `${10 + (i * 15) % 80}%`,
              top: `${15 + (i * 23) % 70}%`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: 'easeInOut' }}
          >
            {tag}
          </motion.div>
        ))}
      </div>

      <div className="container relative z-10 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left column */}
          <motion.div
            className="flex flex-col gap-8"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Badge */}
            <div className="flex items-center gap-3">
              <div className="badge-premium">
                <Sparkles className="h-3 w-3" />
                {BADGE_TEXT}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-brand-400 text-brand-400" />
                <span className="font-medium">4.9/5</span>
                <span>from 2,000+ learners</span>
              </div>
            </div>

            {/* Headline */}
            <div className="flex flex-col gap-4">
              <h1 className="font-display text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.05]">
                Master{' '}
                <span className="gradient-text">DAX</span>{' '}
                &amp;{' '}
                <span className="gradient-text-navy">Power Query</span>
              </h1>
              <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-lg">
                The enterprise-grade learning portal for Power BI professionals.
                Interactive docs, live playground, and structured learning paths
                — all in one premium experience.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/learn/paths"
                className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-400 px-7 text-sm font-bold text-white shadow-glow-gold hover:shadow-glow-gold/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs/dax"
                className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-7 text-sm font-semibold hover:bg-muted hover:-translate-y-0.5 transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                Browse Docs
              </Link>
              <Link
                href="/playground"
                className="inline-flex h-12 items-center gap-2.5 rounded-xl border border-navy-500/30 bg-navy-600/10 px-7 text-sm font-semibold text-navy-400 hover:bg-navy-600/20 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Play className="h-4 w-4" />
                Live Playground
              </Link>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex -space-x-2">
                {['A', 'B', 'C', 'D', 'E'].map((l, i) => (
                  <div
                    key={l}
                    className="h-8 w-8 rounded-full border-2 border-background flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: ['#e59010','#3b5bdb','#10b981','#f59e0b','#6366f1'][i] }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Join <span className="font-semibold text-foreground">12,000+</span> analysts learning on Power BI Mastery
              </p>
            </div>
          </motion.div>

          {/* Right column — code preview cards */}
          <motion.div
            className="relative hidden lg:flex flex-col gap-4"
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            {/* DAX card */}
            <div className="glass-card p-0 overflow-hidden premium-border animate-float" style={{ animationDelay: '0s' }}>
              <div className="code-block-header">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-muted-foreground/60">measure.dax</span>
                </div>
                <span className="badge-premium text-[10px] px-2 py-0.5">DAX</span>
              </div>
              <pre className="p-5 text-xs leading-relaxed overflow-x-auto">
                <code className="font-mono text-foreground/90">
                  {CODE_SNIPPET_DAX.split('\n').map((line, i) => (
                    <div key={i} className="leading-6">
                      {line.startsWith('  ') && (
                        <span className="text-muted-foreground/40 select-none mr-4 text-[10px]">{i + 1}</span>
                      )}
                      {line.includes('CALCULATE') || line.includes('DATESYTD') ? (
                        <span>
                          {line.split(/(CALCULATE|DATESYTD)/).map((part, j) =>
                            ['CALCULATE', 'DATESYTD'].includes(part) ? (
                              <span key={j} className="text-brand-400 font-semibold">{part}</span>
                            ) : <span key={j} className="text-sky-300">{part}</span>
                          )}
                        </span>
                      ) : (
                        <span className={line.startsWith('/*') || line.startsWith(' *') ? 'text-muted-foreground/60 italic' : 'text-emerald-300'}>{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* M card */}
            <div className="glass-card p-0 overflow-hidden ml-12" style={{ border: '1px solid rgba(59,91,219,0.2)', boxShadow: '0 0 0 1px rgba(59,91,219,0.1), 0 8px 40px -8px rgba(59,91,219,0.2)' }}>
              <div className="code-block-header">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/80" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <div className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-muted-foreground/60">query.pq</span>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-navy-600/20 text-navy-400 border border-navy-500/30">M</span>
              </div>
              <pre className="p-5 text-xs leading-relaxed overflow-x-auto">
                <code className="font-mono">
                  {CODE_SNIPPET_M.split('\n').map((line, i) => (
                    <div key={i} className="leading-6">
                      {line.startsWith('//') ? (
                        <span className="text-muted-foreground/60 italic">{line}</span>
                      ) : line.includes('let') || line.includes('in') ? (
                        <span className="text-navy-400 font-semibold">{line}</span>
                      ) : line.includes('Sql.Database') || line.includes('Table.SelectRows') ? (
                        <span className="text-indigo-400">{line}</span>
                      ) : (
                        <span className="text-foreground/80">{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>

            {/* Floating metric badge */}
            <motion.div
              className="absolute -bottom-4 -left-4 glass rounded-xl px-4 py-3 flex items-center gap-3 shadow-card-hover"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            >
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <Code2 className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">500+ Functions</p>
                <p className="text-[10px] text-muted-foreground">DAX &amp; M documented</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs text-muted-foreground">Explore below</span>
          <motion.div
            className="h-5 w-0.5 rounded-full bg-muted-foreground/40"
            animate={{ scaleY: [1, 0.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </div>
    </section>
  )
}
