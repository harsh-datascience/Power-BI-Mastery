'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight, Search, BookOpen, X } from 'lucide-react'

// Navigation tree built from the actual folder contents
const NAV_TREE = [
  {
    id: 'dax',
    label: 'DAX Reference',
    icon: '⚡',
    color: 'text-brand-500',
    items: [
      {
        label: 'Overview',
        items: [
          { label: 'DAX Overview', href: '/docs/dax/overview' },
          { label: 'DAX Queries', href: '/docs/dax/queries' },
          { label: 'DAX Copilot', href: '/docs/dax/copilot' },
          { label: 'Sample Model', href: '/docs/dax/sample-model' },
        ],
      },
      {
        label: 'Best Practices',
        items: [
          { label: 'Avoid FILTER as argument', href: '/docs/dax/best-practices/dax-avoid-avoid-filter-as-filter-argument' },
          { label: 'Avoid converting BLANK', href: '/docs/dax/best-practices/dax-avoid-converting-blank' },
          { label: 'Column & measure references', href: '/docs/dax/best-practices/dax-column-measure-references' },
          { label: 'Use COUNTROWS over COUNT', href: '/docs/dax/best-practices/dax-countrows' },
          { label: 'DIVIDE vs / operator', href: '/docs/dax/best-practices/dax-divide-function-operator' },
          { label: 'Error functions', href: '/docs/dax/best-practices/dax-error-functions' },
          { label: 'Use SELECTEDVALUE', href: '/docs/dax/best-practices/dax-selectedvalue' },
          { label: 'Understand ORDERBY', href: '/docs/dax/best-practices/dax-understand-orderby' },
          { label: 'Unicode behavior', href: '/docs/dax/best-practices/dax-unicode-character-behavior' },
          { label: 'User-defined functions', href: '/docs/dax/best-practices/dax-user-defined-functions' },
          { label: 'Use variables', href: '/docs/dax/best-practices/dax-variables' },
        ],
      },
      {
        label: 'Function Categories',
        items: [
          { label: 'Aggregation', href: '/docs/dax/functions/aggregation' },
          { label: 'Date & Time', href: '/docs/dax/functions/date-time' },
          { label: 'Filter', href: '/docs/dax/functions/filter' },
          { label: 'Information', href: '/docs/dax/functions/information' },
          { label: 'Logical', href: '/docs/dax/functions/logical' },
          { label: 'Math & Trig', href: '/docs/dax/functions/math-trig' },
          { label: 'Statistical', href: '/docs/dax/functions/statistical' },
          { label: 'Text', href: '/docs/dax/functions/text' },
          { label: 'Time Intelligence', href: '/docs/dax/functions/time-intelligence' },
          { label: 'Table manipulation', href: '/docs/dax/functions/table-manipulation' },
        ],
      },
    ],
  },
  {
    id: 'm',
    label: 'M Language',
    icon: '🔄',
    color: 'text-navy-400',
    items: [
      {
        label: 'Language Spec',
        items: [
          { label: 'Introduction', href: '/docs/m/m-spec-introduction' },
          { label: 'Basic Concepts', href: '/docs/m/m-spec-basic-concepts' },
          { label: 'Values', href: '/docs/m/m-spec-values' },
          { label: 'Lexical Structure', href: '/docs/m/m-spec-lexical-structure' },
          { label: 'Operators', href: '/docs/m/m-spec-operators' },
          { label: 'Let Expression', href: '/docs/m/m-spec-let' },
          { label: 'Conditionals', href: '/docs/m/m-spec-conditionals' },
          { label: 'Functions', href: '/docs/m/m-spec-functions' },
          { label: 'Error Handling', href: '/docs/m/m-spec-error-handling' },
          { label: 'Types', href: '/docs/m/m-spec-types' },
        ],
      },
      {
        label: 'Function Reference',
        items: [
          { label: 'Accessing Data', href: '/docs/m/accessing-data-functions' },
          { label: 'Binary Functions', href: '/docs/m/binary-functions' },
          { label: 'Combiner Functions', href: '/docs/m/combiner-functions' },
          { label: 'Comparer Functions', href: '/docs/m/comparer-functions' },
          { label: 'Date Functions', href: '/docs/m/date-functions' },
          { label: 'DateTime Functions', href: '/docs/m/datetime-functions' },
          { label: 'Duration Functions', href: '/docs/m/duration-functions' },
          { label: 'List Functions', href: '/docs/m/list-functions' },
          { label: 'Logical Functions', href: '/docs/m/logical-functions' },
          { label: 'Number Functions', href: '/docs/m/number-functions' },
          { label: 'Record Functions', href: '/docs/m/record-functions' },
          { label: 'Replacer Functions', href: '/docs/m/replacer-functions' },
          { label: 'Splitter Functions', href: '/docs/m/splitter-functions' },
          { label: 'Table Functions', href: '/docs/m/table-functions' },
          { label: 'Text Functions', href: '/docs/m/text-functions' },
          { label: 'Time Functions', href: '/docs/m/time-functions' },
          { label: 'Type Functions', href: '/docs/m/type-functions' },
          { label: 'URI Functions', href: '/docs/m/uri-functions' },
          { label: 'Value Functions', href: '/docs/m/value-functions' },
        ],
      },
      {
        label: 'Connectors',
        items: [
          { label: 'SQL Server', href: '/docs/m/sql-database' },
          { label: 'Azure Blob Storage', href: '/docs/m/azurestorage-blobs' },
          { label: 'Azure Data Lake', href: '/docs/m/azurestorage-datalake' },
          { label: 'SharePoint Files', href: '/docs/m/sharepoint-files' },
          { label: 'OData Feed', href: '/docs/m/odata-feed' },
          { label: 'Web Contents', href: '/docs/m/web-contents' },
          { label: 'SAP HANA', href: '/docs/m/saphana-database' },
          { label: 'Salesforce', href: '/docs/m/salesforce-data' },
          { label: 'Excel Workbook', href: '/docs/m/excel-workbook' },
          { label: 'JSON Document', href: '/docs/m/json-document' },
          { label: 'CSV Document', href: '/docs/m/csv-document' },
        ],
      },
    ],
  },
]

type NavGroup = (typeof NAV_TREE)[0]
type NavSection = NavGroup['items'][0]

export function DocsSidebar() {
  const pathname = usePathname()
  const [search, setSearch] = useState('')
  const [openGroups, setOpenGroups] = useState<string[]>(['dax', 'm'])
  const [openSections, setOpenSections] = useState<string[]>(['Overview', 'Best Practices', 'Language Spec', 'Function Reference'])

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id])

  const toggleSection = (label: string) =>
    setOpenSections((prev) => prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label])

  const filterItems = (items: NavSection['items'], query: string) =>
    items.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <aside className="sticky top-16 hidden md:flex flex-col h-[calc(100dvh-4rem)] border-r border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-md border border-border bg-background pl-8 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Nav tree */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {NAV_TREE.map((group) => {
          const isOpen = openGroups.includes(group.id)
          return (
            <div key={group.id} className="mb-4">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span>{group.icon}</span>
                  <span className={group.color}>{group.label}</span>
                </span>
                <ChevronRight className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', isOpen && 'rotate-90')} />
              </button>

              {isOpen && (
                <div className="mt-1 ml-2">
                  {group.items.map((section) => {
                    const filteredItems = search ? filterItems(section.items, search) : section.items
                    if (search && filteredItems.length === 0) return null
                    const isSectionOpen = openSections.includes(section.label)

                    return (
                      <div key={section.label} className="mb-1">
                        <button
                          onClick={() => toggleSection(section.label)}
                          className="flex w-full items-center justify-between rounded-md px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {section.label}
                          <ChevronRight className={cn('h-3 w-3 transition-transform', isSectionOpen && 'rotate-90')} />
                        </button>

                        {isSectionOpen && (
                          <div className="ml-2 flex flex-col gap-0.5">
                            {filteredItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  'nav-item text-xs py-1.5',
                                  pathname === item.href && 'nav-item-active'
                                )}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Bottom: version badge */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Docs v1.0 · Power BI 2024</span>
        </div>
      </div>
    </aside>
  )
}
