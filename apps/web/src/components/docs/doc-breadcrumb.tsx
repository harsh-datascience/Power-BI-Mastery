import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface Props {
  category: 'dax' | 'm'
  subcategory: string
}

export function DocBreadcrumb({ category, subcategory }: Props) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors"><Home className="h-3 w-3" /></Link>
      <ChevronRight className="h-3 w-3" />
      <Link href="/docs" className="hover:text-foreground transition-colors">Docs</Link>
      <ChevronRight className="h-3 w-3" />
      <Link href={`/docs/${category}`} className="hover:text-foreground capitalize transition-colors">
        {category === 'dax' ? 'DAX' : 'M Language'}
      </Link>
      {subcategory && (
        <>
          <ChevronRight className="h-3 w-3" />
          <span className="capitalize">{subcategory.replace(/-/g, ' ')}</span>
        </>
      )}
    </nav>
  )
}
