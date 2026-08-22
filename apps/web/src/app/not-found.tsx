import Link from 'next/link'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { BookOpen, Home, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-md px-4">
          <div className="font-display text-9xl font-bold gradient-text mb-6">404</div>
          <h1 className="text-2xl font-bold mb-3">Page not found</h1>
          <p className="text-muted-foreground mb-8">
            The page you were looking for does not exist. It may have been moved or the URL is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 h-10 rounded-lg bg-gradient-to-r from-brand-500 to-amber-400 px-5 text-sm font-semibold text-white"
            >
              <Home className="h-4 w-4" /> Go Home
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 h-10 rounded-lg border border-border px-5 text-sm font-semibold hover:bg-muted transition-colors"
            >
              <BookOpen className="h-4 w-4" /> Browse Docs
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
