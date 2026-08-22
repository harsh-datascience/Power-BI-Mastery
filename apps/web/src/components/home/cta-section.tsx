'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, BookOpen, Play } from 'lucide-react'

export function CtaSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <motion.div
          className="relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/10 via-background to-navy-600/10 p-12 lg:p-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative glow */}
          <div className="hero-glow hero-glow-gold absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
          <div className="hero-glow hero-glow-navy absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 opacity-15" />

          <div className="relative z-10 flex flex-col items-center gap-8">
            <div className="badge-premium">
              <Zap className="h-3 w-3" /> Start For Free Today
            </div>

            <div>
              <h2 className="font-display text-4xl lg:text-6xl font-bold tracking-tight">
                Ready to <span className="gradient-text">Master</span>
                <br />Power BI?
              </h2>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto">
                Join 12,000+ professionals who use Power BI Mastery to level up their DAX and M language skills every day.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/learn/paths"
                className="group inline-flex h-13 items-center gap-2.5 rounded-xl bg-gradient-to-r from-brand-500 to-amber-400 px-8 py-3.5 text-base font-bold text-white shadow-glow-gold hover:shadow-glow-gold/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Learning Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/docs/dax"
                className="inline-flex h-13 items-center gap-2.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm px-8 py-3.5 text-base font-semibold hover:bg-muted transition-colors"
              >
                <BookOpen className="h-5 w-5" /> Browse Reference Docs
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              Free forever · No credit card required · Sign in with Microsoft, GitHub, or Google
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
