import Link from 'next/link'
import { Zap, Github, Twitter, Linkedin, Youtube, Mail } from 'lucide-react'

const FOOTER_SECTIONS = [
  {
    title: 'Learn',
    links: [
      { label: 'Learning Paths', href: '/learn/paths' },
      { label: 'DAX Fundamentals', href: '/learn/dax-fundamentals' },
      { label: 'M Language', href: '/learn/m-basics' },
      { label: 'Advanced DAX', href: '/learn/advanced-dax' },
      { label: 'Playground', href: '/playground' },
    ],
  },
  {
    title: 'DAX Reference',
    links: [
      { label: 'Function Reference', href: '/docs/dax/functions' },
      { label: 'Best Practices', href: '/docs/dax/best-practices' },
      { label: 'DAX Queries', href: '/docs/dax/queries' },
      { label: 'Time Intelligence', href: '/docs/dax/time-intelligence' },
      { label: 'Filter Context', href: '/docs/dax/filter-context' },
    ],
  },
  {
    title: 'M Language',
    links: [
      { label: 'Function Reference', href: '/docs/m/functions' },
      { label: 'Language Spec', href: '/docs/m/specification' },
      { label: 'Data Connectors', href: '/docs/m/connectors' },
      { label: 'Table Functions', href: '/docs/m/table' },
      { label: 'List Functions', href: '/docs/m/list' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

const SOCIAL = [
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container py-16">
        {/* Top: Logo + newsletter */}
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 pb-12 border-b border-border">
          <div className="flex flex-col gap-4 max-w-sm">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-amber-400">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-base">
                Power<span className="gradient-text">BI</span> Mastery
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The enterprise-grade learning portal for Power BI professionals.
              Master DAX &amp; Power Query M with interactive docs and guided paths.
            </p>
            <div className="flex gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-3 max-w-sm">
            <p className="font-semibold text-sm">Get DAX &amp; M tips in your inbox</p>
            <p className="text-sm text-muted-foreground">Weekly snippets, patterns, and best practices.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@company.com"
                className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
              <button
                type="submit"
                className="h-9 rounded-lg bg-gradient-to-r from-brand-500 to-amber-400 px-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Middle: Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Power BI Mastery. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">Powered by Microsoft Power BI docs</span>
            <span className="badge-premium">Enterprise Grade</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
