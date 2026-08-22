'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import {
  Search, Menu, X, Sun, Moon, Zap,
  ChevronDown, Github
} from 'lucide-react'

const NAV_ITEMS = [
  {
    label: 'Learn',
    href: '/learn',
    children: [
      { label: 'Learning Paths', href: '/learn/paths', description: 'Structured courses for all levels' },
      { label: 'DAX Fundamentals', href: '/learn/dax-fundamentals', description: 'Start with DAX basics' },
      { label: 'M Language Basics', href: '/learn/m-basics', description: 'Power Query fundamentals' },
      { label: 'Advanced DAX', href: '/learn/advanced-dax', description: 'Master complex patterns' },
    ],
  },
  {
    label: 'DAX Reference',
    href: '/docs/dax',
    children: [
      { label: 'Function Reference', href: '/docs/dax/functions', description: '300+ DAX functions documented' },
      { label: 'Best Practices', href: '/docs/dax/best-practices', description: 'Expert DAX patterns' },
      { label: 'DAX Queries', href: '/docs/dax/queries', description: 'Query syntax & examples' },
      { label: 'Calculations', href: '/docs/dax/calculations', description: 'Measures & columns' },
    ],
  },
  {
    label: 'M Reference',
    href: '/docs/m',
    children: [
      { label: 'Function Reference', href: '/docs/m/functions', description: '500+ M functions documented' },
      { label: 'Language Spec', href: '/docs/m/specification', description: 'Official M language spec' },
      { label: 'Data Sources', href: '/docs/m/connectors', description: 'Connect to any data source' },
      { label: 'Transformations', href: '/docs/m/transformations', description: 'Table, List, Record operations' },
    ],
  },
  { label: 'Playground', href: '/playground' },
  { label: 'Blog', href: '/blog' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-amber-400 shadow-glow-gold group-hover:shadow-glow-gold transition-shadow">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-base tracking-tight">
              Power<span className="gradient-text">BI</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Mastery
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                  <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', openDropdown === item.label && 'rotate-180')} />
                </button>
                {openDropdown === item.label && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-popover p-2 shadow-card-hover animate-fade-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="flex flex-col gap-0.5 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        <span className="text-sm font-medium text-foreground">{child.label}</span>
                        <span className="text-xs text-muted-foreground">{child.description}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search trigger */}
          <button
            className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted transition-colors"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Search docs...</span>
            <kbd className="hidden md:inline-flex h-5 items-center gap-1 rounded border border-border bg-background px-1.5 text-[10px] font-mono text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>

          {/* CTA */}
          <Link
            href="/learn"
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-amber-400 px-4 text-sm font-semibold text-white shadow-glow-gold hover:shadow-glow-gold/70 transition-all hover:-translate-y-px"
          >
            Start Learning
          </Link>

          {/* Mobile menu button */}
          <button
            className="lg:hidden rounded-md p-2 text-muted-foreground hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-border">
              <Link
                href="/learn"
                className="flex h-10 w-full items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-amber-400 text-sm font-semibold text-white"
                onClick={() => setMobileOpen(false)}
              >
                Start Learning Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
