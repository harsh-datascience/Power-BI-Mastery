'use client'

import { motion } from 'framer-motion'
import {
  BookOpen, Search, BookMarked,
  Layers, MonitorPlay, Brain, Shield, Gauge, Globe
} from 'lucide-react'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Complete Documentation',
    description: '500+ M functions and 300+ DAX functions with syntax, parameters, examples and usage notes — all searchable.',
    color: 'from-brand-500/20 to-amber-400/10',
    border: 'border-brand-500/20',
    iconColor: 'text-brand-500',
  },
  {
    icon: MonitorPlay,
    title: 'Live Code Playground',
    description: 'Write and run DAX queries and M expressions directly in the browser with real-time results, IntelliSense, and sample datasets.',
    color: 'from-navy-600/20 to-navy-400/10',
    border: 'border-navy-500/20',
    iconColor: 'text-navy-400',
  },
  {
    icon: Layers,
    title: 'Structured Learning Paths',
    description: 'Follow curated learning journeys from Beginner to Expert, with progress tracking, exercises, and completion certificates.',
    color: 'from-emerald-500/20 to-teal-400/10',
    border: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Search,
    title: 'Instant Smart Search',
    description: 'Find any function, concept, or example instantly with typo-tolerant, faceted search across the entire documentation.',
    color: 'from-purple-500/20 to-violet-400/10',
    border: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Brain,
    title: 'AI-Powered Explanations',
    description: 'Get plain-English explanations of complex formulas, context-aware suggestions, and formula debugging assistance.',
    color: 'from-pink-500/20 to-rose-400/10',
    border: 'border-pink-500/20',
    iconColor: 'text-pink-400',
  },
  {
    icon: BookMarked,
    title: 'Bookmarks & Notes',
    description: 'Bookmark any page, add personal notes, highlight code snippets, and build your own reference library.',
    color: 'from-orange-500/20 to-amber-400/10',
    border: 'border-orange-500/20',
    iconColor: 'text-orange-400',
  },
  {
    icon: Gauge,
    title: 'Performance Best Practices',
    description: 'Learn DAX and M optimization patterns, query folding, evaluation context, and enterprise-scale techniques.',
    color: 'from-cyan-500/20 to-sky-400/10',
    border: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
  },
  {
    icon: Shield,
    title: 'Offline & PWA Support',
    description: 'Install as a desktop app and access all documentation offline. Perfect for air-gapped enterprise environments.',
    color: 'from-slate-500/20 to-gray-400/10',
    border: 'border-slate-500/20',
    iconColor: 'text-slate-400',
  },
  {
    icon: Globe,
    title: 'Enterprise Ready',
    description: 'SSO via Microsoft, GitHub or Google. Role-based access, team progress dashboards, and audit logs.',
    color: 'from-indigo-500/20 to-blue-400/10',
    border: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="badge-premium mx-auto mb-4">Everything You Need</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
            Built for <span className="gradient-text">Professionals</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Every feature designed to maximize your learning velocity and reference efficiency.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              className={`group relative rounded-xl border ${f.border} bg-gradient-to-br ${f.color} p-6 card-hover`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-background/60 border border-border/50`}>
                <f.icon className={`h-5 w-5 ${f.iconColor}`} />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
