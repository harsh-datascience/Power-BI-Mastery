'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { List } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function DocsToc() {
  const [headings, setHeadings] = useState<TocItem[]>([])
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll('main h2, main h3')
    ) as HTMLHeadingElement[]

    // Only headings with an id can be linked. Hand-written pages (/docs,
    // /docs/dax) render h2s without ids, which produced several TOC entries
    // keyed on "" (a duplicate-key warning) that all pointed at bare "#".
    const linkable = els.filter((el) => el.id)

    setHeadings(
      linkable.map((el) => ({
        id: el.id,
        text: el.textContent ?? '',
        level: Number(el.tagName[1]),
      }))
    )

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-80px 0px -60% 0px' }
    )

    linkable.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  if (headings.length === 0) return null

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        <List className="h-3 w-3" />
        On This Page
      </div>
      <nav className="flex flex-col gap-0.5">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={cn(
              'text-xs py-1 transition-colors hover:text-foreground',
              h.level === 2 ? 'pl-0' : 'pl-4',
              active === h.id
                ? 'text-primary font-medium'
                : 'text-muted-foreground'
            )}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  )
}
