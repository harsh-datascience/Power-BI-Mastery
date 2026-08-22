import { Clock } from 'lucide-react'
import { CATEGORY_META, type Category } from '@/lib/utils'

interface Props {
  title: string
  description: string
  category: Category
  readingTime: number
}

export function DocMetaHeader({ title, description, category, readingTime }: Props) {
  const meta = CATEGORY_META[category]
  return (
    <div className="border-b border-border pb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${meta.borderColor} ${meta.bgColor} ${meta.textColor}`}>
          <span>{meta.icon}</span>
          {meta.label}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          {readingTime} min read
        </span>
      </div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-3">{title}</h1>
      {description && (
        <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  )
}
