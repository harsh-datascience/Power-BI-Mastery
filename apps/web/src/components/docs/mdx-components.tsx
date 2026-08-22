import { cn } from '@/lib/utils'

// Shared MDX component overrides for premium styling
export const mdxComponents = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="font-display text-4xl font-bold tracking-tight mt-0 mb-6 scroll-mt-20" {...props}>{children}</h1>
  ),
  h2: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 id={id} className="font-display text-2xl font-bold tracking-tight mt-12 mb-4 scroll-mt-20 group flex items-center gap-2" {...props}>
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-50 text-muted-foreground hover:text-foreground transition-opacity">#</a>
    </h2>
  ),
  h3: ({ children, id, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 id={id} className="font-semibold text-xl mt-8 mb-3 scroll-mt-20 group flex items-center gap-2" {...props}>
      {children}
      <a href={`#${id}`} className="opacity-0 group-hover:opacity-50 text-muted-foreground">#</a>
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="font-semibold text-base mt-6 mb-2" {...props}>{children}</h4>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 text-muted-foreground mb-4" {...props}>{children}</p>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc space-y-2 text-muted-foreground" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal space-y-2 text-muted-foreground" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="leading-7" {...props}>{children}</li>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="my-6 rounded-r-lg border-l-4 border-primary/50 bg-primary/5 px-5 py-4 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <thead className="bg-muted/60 font-medium" {...props}>{children}</thead>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors" {...props}>{children}</tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground" {...props}>{children}</th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="px-4 py-3 text-muted-foreground" {...props}>{children}</td>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isBlock = className?.includes('language-')
    if (isBlock) {
      return <code className={cn('text-sm font-mono', className)} {...props}>{children}</code>
    }
    return (
      <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono font-medium text-primary" {...props}>
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <div className="code-block-wrapper my-6">
      <div className="code-block-header">
        <span className="text-muted-foreground/60">Code</span>
      </div>
      <pre className="overflow-x-auto rounded-b-lg bg-muted/40 p-5 text-sm border-0" {...props}>
        {children}
      </pre>
    </div>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-8 border-border" {...props} />
  ),
  // Custom callout component
  Callout: ({ type = 'info', children }: { type?: 'info' | 'warning' | 'tip' | 'danger'; children: React.ReactNode }) => {
    const styles = {
      info: 'border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400',
      warning: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400',
      tip: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400',
      danger: 'border-red-500/30 bg-red-500/5 text-red-600 dark:text-red-400',
    }
    const icons = { info: 'ℹ️', warning: '⚠️', tip: '💡', danger: '🔥' }
    return (
      <div className={cn('my-6 flex gap-3 rounded-lg border p-4', styles[type])}>
        <span className="shrink-0">{icons[type]}</span>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
    )
  },
}
