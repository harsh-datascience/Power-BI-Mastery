'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Play, ChevronRight } from 'lucide-react'
import Link from 'next/link'

const TABS = [
  {
    id: 'calculate',
    label: 'CALCULATE',
    category: 'DAX',
    title: 'CALCULATE – The King of DAX',
    description: 'CALCULATE modifies the filter context. It is the most powerful and most used function in DAX.',
    code: `// Sales only for the "West" region
West Sales =
    CALCULATE(
        [Total Sales],
        Regions[Region] = "West"
    )

// Running Total (Year to Date)
Sales YTD =
    CALCULATE(
        [Total Sales],
        DATESYTD ( 'Date'[Date] )
    )

// Previous Year Comparison
Sales PY =
    CALCULATE(
        [Total Sales],
        SAMEPERIODLASTYEAR ( 'Date'[Date] )
    )`,
    language: 'dax',
    href: '/docs/dax/functions/calculate',
  },
  {
    id: 'table-transform',
    label: 'Table.SelectRows',
    category: 'M',
    title: 'Table.SelectRows – Filter Rows in M',
    description: 'Filter rows in a table using a condition function. One of the most common M transformations.',
    code: `// Filter orders above $1000
let
    Source = Excel.Workbook(...),
    Orders = Source{[Name="Orders"]}[Data],
    
    // Keep only high-value orders
    HighValue = Table.SelectRows(
        Orders,
        each [Amount] > 1000
            and [Status] = "Completed"
    ),
    
    // Change column types
    Typed = Table.TransformColumnTypes(
        HighValue,
        {{"Amount", Currency.Type},
         {"Date", type date}}
    )
in
    Typed`,
    language: 'm',
    href: '/docs/m/table-selectrows',
  },
  {
    id: 'time-intel',
    label: 'Time Intelligence',
    category: 'DAX',
    title: 'Time Intelligence Functions',
    description: 'DAX has 35+ time intelligence functions for YTD, QTD, MTD, comparisons, and rolling periods.',
    code: `// Month over Month Growth %
MoM Growth % =
    VAR CurrentMonth = [Total Sales]
    VAR PreviousMonth =
        CALCULATE(
            [Total Sales],
            DATEADD( 'Date'[Date], -1, MONTH )
        )
    RETURN
        DIVIDE(
            CurrentMonth - PreviousMonth,
            PreviousMonth,
            BLANK()
        )

// Rolling 3-Month Average
Rolling 3M Avg =
    CALCULATE(
        AVERAGEX( VALUES( 'Date'[Month] ), [Total Sales] ),
        DATESINPERIOD( 'Date'[Date], LASTDATE( 'Date'[Date] ), -3, MONTH )
    )`,
    language: 'dax',
    href: '/docs/dax/time-intelligence',
  },
  {
    id: 'list-transform',
    label: 'List.Transform',
    category: 'M',
    title: 'List.Transform – Map over Lists',
    description: 'Apply a function to every element in a list. The M equivalent of Array.map().',
    code: `// Uppercase all product names
let
    Products = {"apple", "banana", "cherry"},
    
    // Apply Text.Upper to each element
    Uppercased = List.Transform(
        Products,
        Text.Upper
    ),
    // Result: {"APPLE", "BANANA", "CHERRY"}
    
    // With custom function
    Formatted = List.Transform(
        {1..10},
        each "Item " & Text.From(_)
    )
    // Result: {"Item 1", "Item 2", ...}
in
    Formatted`,
    language: 'm',
    href: '/docs/m/list-transform',
  },
]

export function CodeShowcaseSection() {
  const [activeTab, setActiveTab] = useState(TABS[0]!.id)
  const [copied, setCopied] = useState(false)

  const current = TABS.find((t) => t.id === activeTab)!

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="py-24 lg:py-32">
      <div className="container">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="badge-premium mx-auto mb-4">Interactive Examples</div>
          <h2 className="font-display text-4xl lg:text-5xl font-bold tracking-tight">
            Code That <span className="gradient-text">Teaches</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Every function includes annotated examples you can copy, edit, and run in the playground.
          </p>
        </motion.div>

        <motion.div
          className="rounded-2xl border border-border overflow-hidden shadow-card-hover"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Tab bar */}
          <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-4 py-2 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${
                  tab.category === 'DAX' ? 'bg-brand-500' : 'bg-navy-400'
                }`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_1.6fr]">
            {/* Description panel */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id + '-desc'}
                className="flex flex-col gap-4 p-8 border-r border-border"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                  current.category === 'DAX'
                    ? 'bg-brand-500/10 text-brand-500 border-brand-500/30'
                    : 'bg-navy-500/10 text-navy-400 border-navy-500/30'
                }`}>
                  {current.category}
                </span>
                <h3 className="font-display text-xl font-bold">{current.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
                <div className="flex flex-col gap-2 mt-auto">
                  <Link
                    href={current.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                  >
                    Read full docs <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href="/playground"
                    className="inline-flex items-center gap-2 h-9 w-fit rounded-lg bg-muted border border-border px-4 text-xs font-medium hover:bg-muted/70 transition-colors"
                  >
                    <Play className="h-3.5 w-3.5" /> Try in Playground
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Code panel */}
            <div className="relative">
              <div className="absolute top-3 right-3 z-10 flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 rounded-md border border-border bg-background/80 backdrop-blur-sm px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <AnimatePresence mode="wait">
                <motion.pre
                  key={current.id + '-code'}
                  className="p-8 text-sm font-mono leading-relaxed overflow-x-auto bg-muted/30 min-h-[320px] border-0 rounded-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <code className="text-foreground/85">{current.code}</code>
                </motion.pre>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
