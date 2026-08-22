import { type ReactNode } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { DocsSidebar } from '@/components/docs/docs-sidebar'
import { DocsToc } from '@/components/docs/docs-toc'

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <div className="doc-layout flex-1">
        {/* Left sidebar – navigation */}
        <DocsSidebar />
        {/* Main content */}
        <main
          id="main-content"
          className="min-w-0 px-6 py-10 lg:px-10 xl:px-14"
        >
          {children}
        </main>
        {/* Right sidebar – table of contents */}
        <aside className="hidden xl:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto px-6 py-10">
          <DocsToc />
        </aside>
      </div>
    </div>
  )
}
