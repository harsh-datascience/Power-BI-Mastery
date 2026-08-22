'use client'

import { motion } from 'framer-motion'
import { Users, BookOpen, Code2, Trophy } from 'lucide-react'

const STATS = [
  { icon: Users, label: 'Active Learners', value: '12,000+', color: 'text-brand-500' },
  { icon: BookOpen, label: 'Functions Documented', value: '500+', color: 'text-navy-400' },
  { icon: Code2, label: 'Code Examples', value: '1,200+', color: 'text-emerald-400' },
  { icon: Trophy, label: 'Completion Rate', value: '87%', color: 'text-amber-400' },
]

export function StatsSection() {
  return (
    <section className="border-y border-border bg-muted/30 py-14">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center gap-3 text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className={`rounded-xl p-3 bg-muted border border-border`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-3xl font-bold font-display ${stat.color}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
