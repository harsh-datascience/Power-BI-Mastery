'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Senior BI Developer',
    company: 'Microsoft',
    avatar: 'SC',
    avatarColor: '#e59010',
    rating: 5,
    text: 'Power BI Mastery completely transformed how I reference DAX. The search is instant, examples are real-world, and the playground is invaluable. This is what enterprise docs should feel like.',
  },
  {
    name: 'James Rodriguez',
    role: 'Data Analytics Manager',
    company: 'Deloitte',
    avatar: 'JR',
    avatarColor: '#3b5bdb',
    rating: 5,
    text: 'Our team of 20 analysts uses this daily. The learning paths cut onboarding time in half. The M function reference alone is worth everything — best documentation I\'ve ever used.',
  },
  {
    name: 'Priya Sharma',
    role: 'Power Platform Architect',
    company: 'Accenture',
    avatar: 'PS',
    avatarColor: '#10b981',
    rating: 5,
    text: 'The DAX best practices section is gold. I send every junior analyst straight here. Dark mode, offline support, and the code playground make this a 10/10 resource.',
  },
  {
    name: 'Tom Eriksen',
    role: 'BI Lead',
    company: 'KPMG',
    avatar: 'TE',
    avatarColor: '#6366f1',
    rating: 5,
    text: 'I\'ve been using Power BI since 2016 and this is the reference portal I always wished existed. The M language spec with examples is particularly outstanding.',
  },
  {
    name: 'Aisha Okonkwo',
    role: 'Analytics Engineer',
    company: 'Goldman Sachs',
    avatar: 'AO',
    avatarColor: '#f59e0b',
    rating: 5,
    text: 'The combination of searchable docs, learning paths, and interactive playground is unmatched. I leveled up my DAX skills from intermediate to advanced in 3 weeks.',
  },
  {
    name: 'David Park',
    role: 'Head of Data',
    company: 'Shopify',
    avatar: 'DP',
    avatarColor: '#ec4899',
    rating: 5,
    text: 'Premium quality portal. The UI is clean, fast, and polished. It feels like a product built by people who actually use Power BI daily. Highly recommend for any BI team.',
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-muted/20">
      <div className="container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="badge-premium mx-auto mb-4">Trusted by Professionals</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
            Loved by <span className="gradient-text">12,000+ Analysts</span>
          </h2>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              className="break-inside-avoid rounded-xl border border-border bg-card p-6 card-hover"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Quote className="h-6 w-6 text-muted-foreground/30 mb-3" />
              <p className="text-sm leading-relaxed text-muted-foreground mb-5">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: t.avatarColor }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-brand-400 text-brand-400" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
