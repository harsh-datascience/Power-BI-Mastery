import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.slice(0, length)}…` : str
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeDate(date: Date | string) {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diff = (new Date(date).getTime() - Date.now()) / 1000
  const absDiff = Math.abs(diff)

  if (absDiff < 60) return rtf.format(Math.round(diff), 'second')
  if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute')
  if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
  if (absDiff < 2592000) return rtf.format(Math.round(diff / 86400), 'day')
  if (absDiff < 31536000) return rtf.format(Math.round(diff / 2592000), 'month')
  return rtf.format(Math.round(diff / 31536000), 'year')
}

export function estimateReadingTime(content: string) {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return minutes
}

export function absoluteUrl(path: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}${path}`
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Category metadata
export const CATEGORY_META = {
  dax: {
    label: 'DAX',
    fullLabel: 'Data Analysis Expressions',
    color: 'from-brand-500 to-amber-400',
    bgColor: 'bg-brand-500/10',
    textColor: 'text-brand-600 dark:text-brand-400',
    borderColor: 'border-brand-500/30',
    icon: '⚡',
    description: 'Master the DAX formula language for creating powerful calculations and business metrics in Power BI.',
  },
  m: {
    label: 'M',
    fullLabel: 'Power Query M Language',
    color: 'from-navy-600 to-navy-400',
    bgColor: 'bg-navy-600/10',
    textColor: 'text-navy-600 dark:text-navy-400',
    borderColor: 'border-navy-500/30',
    icon: '🔄',
    description: 'Learn Power Query M language for advanced data transformation, cleaning, and ETL workflows.',
  },
} as const

export type Category = keyof typeof CATEGORY_META

export const DIFFICULTY_META = {
  beginner: { label: 'Beginner', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10' },
  advanced: { label: 'Advanced', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-500/10' },
  expert: { label: 'Expert', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
} as const
