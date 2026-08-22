'use client'

import { useState } from 'react'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { Copy, Check, Play, RotateCcw, Zap, Code2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const TEMPLATES = {
  dax: [
    {
      label: 'YTD Sales',
      code: `Sales YTD =\nCALCULATE(\n    [Total Sales],\n    DATESYTD('Date'[Date])\n)`,
    },
    {
      label: 'MoM Growth %',
      code: `MoM Growth % =\nVAR CurrentMonth = [Total Sales]\nVAR PrevMonth =\n    CALCULATE(\n        [Total Sales],\n        DATEADD('Date'[Date], -1, MONTH)\n    )\nRETURN\n    DIVIDE(CurrentMonth - PrevMonth, PrevMonth)`,
    },
    {
      label: 'Running Total',
      code: `Running Total =\nCALCULATE(\n    [Total Sales],\n    FILTER(\n        ALL('Date'),\n        'Date'[Date] <= MAX('Date'[Date])\n    )\n)`,
    },
    {
      label: 'Rank by Sales',
      code: `Sales Rank =\nRANKX(\n    ALL('Products'[ProductName]),\n    [Total Sales],\n    ,\n    DESC,\n    DENSE\n)`,
    },
  ],
  m: [
    {
      label: 'Filter Rows',
      code: `let\n    Source = Excel.Workbook(File.Contents("data.xlsx"), null, true),\n    Sheet1 = Source{[Item="Sheet1",Kind="Sheet"]}[Data],\n    Promoted = Table.PromoteHeaders(Sheet1, [PromoteAllScalars=true]),\n    Filtered = Table.SelectRows(\n        Promoted,\n        each [Status] = "Active" and [Amount] > 1000\n    )\nin\n    Filtered`,
    },
    {
      label: 'Custom Function',
      code: `let\n    // Define a reusable function\n    CleanText = (text as text) as text =>\n        Text.Trim(Text.Upper(text)),\n\n    // Apply to a list\n    Names = {"  alice  ", "  BOB  ", " charlie "},\n    Cleaned = List.Transform(Names, CleanText)\nin\n    Cleaned`,
    },
    {
      label: 'Group & Aggregate',
      code: `let\n    Source = Csv.Document(File.Contents("orders.csv")),\n    Typed = Table.TransformColumnTypes(\n        Source,\n        {{"Amount", Currency.Type}, {"Date", type date}}\n    ),\n    Grouped = Table.Group(\n        Typed,\n        {"Region"},\n        {{"Total", each List.Sum([Amount]), Currency.Type},\n         {"Count", each Table.RowCount(_), Int64.Type}}\n    )\nin\n    Grouped`,
    },
    {
      label: 'Web API Call',
      code: `let\n    Url = "https://api.example.com/data",\n    Response = Web.Contents(Url, [\n        Headers = [#"Content-Type" = "application/json"]\n    ]),\n    Json = Json.Document(Response),\n    Table = Table.FromList(\n        Json[items],\n        Splitter.SplitByNothing()\n    ),\n    Expanded = Table.ExpandRecordColumn(\n        Table, "Column1",\n        {"id", "name", "value"}\n    )\nin\n    Expanded`,
    },
  ],
}

type Language = 'dax' | 'm'

export default function PlaygroundPage() {
  const [lang, setLang] = useState<Language>('dax')
  const [code, setCode] = useState(TEMPLATES.dax[0]!.code)
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = () => {
    setRunning(true)
    setOutput(null)
    // Simulate execution — real engine would call a serverless function
    setTimeout(() => {
      setOutput(
        lang === 'dax'
          ? '✅ Query executed successfully.\n\nResult preview:\n┌──────────────┬────────────┐\n│ Date         │ Value      │\n├──────────────┼────────────┤\n│ Jan 2024     │ 142,500.00 │\n│ Feb 2024     │ 168,300.00 │\n│ Mar 2024     │ 195,750.00 │\n└──────────────┴────────────┘\n\nNote: Connect a real Power BI dataset for live results.'
          : '✅ Expression evaluated successfully.\n\nResult:\n{"type": "table", "rows": 3, "columns": ["Region", "Total", "Count"]}\n\nRow 1: { Region: "North", Total: 145200, Count: 48 }\nRow 2: { Region: "South", Total: 98750, Count: 31 }\nRow 3: { Region: "West", Total: 203100, Count: 67 }\n\nNote: Connect a Power Query engine for live evaluation.'
      )
      setRunning(false)
    }, 1200)
  }

  const handleTemplate = (tmpl: { label: string; code: string }) => {
    setCode(tmpl.code)
    setOutput(null)
  }

  const handleReset = () => {
    setCode(TEMPLATES[lang][0]!.code)
    setOutput(null)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1 container py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-amber-400">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <div className="badge-premium">Interactive Playground</div>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Code Playground</h1>
          <p className="text-muted-foreground max-w-2xl">
            Write and experiment with DAX and M Language code. Choose a template to get started,
            then edit and run to see results.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          {/* Editor panel */}
          <div className="flex flex-col gap-4">
            {/* Language + template bar */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Language tabs */}
              <div className="flex rounded-lg border border-border overflow-hidden">
                {(['dax', 'm'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => {
                      setLang(l)
                      setCode(TEMPLATES[l][0]!.code)
                      setOutput(null)
                    }}
                    className={cn(
                      'px-4 py-2 text-sm font-semibold transition-colors',
                      lang === l
                        ? l === 'dax'
                          ? 'bg-brand-500 text-white'
                          : 'bg-navy-600 text-white'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {l === 'dax' ? '⚡ DAX' : '🔄 M Language'}
                  </button>
                ))}
              </div>

              {/* Templates */}
              <div className="flex flex-wrap gap-2">
                {TEMPLATES[lang].map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => handleTemplate(tmpl)}
                    className={cn(
                      'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                      code === tmpl.code
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code editor */}
            <div className="relative rounded-xl border border-border overflow-hidden">
              <div className="code-block-header">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                    <div className="h-3 w-3 rounded-full bg-green-500/70" />
                  </div>
                  <span className="text-muted-foreground/60 text-xs">
                    {lang === 'dax' ? 'formula.dax' : 'query.pq'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleReset} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Reset">
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={handleCopy} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full min-h-[340px] resize-y bg-muted/30 p-5 font-mono text-sm text-foreground/90 focus:outline-none leading-relaxed"
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
              />
            </div>

            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={running || !code.trim()}
              className={cn(
                'self-start inline-flex items-center gap-2.5 h-10 rounded-lg px-6 text-sm font-semibold transition-all',
                running || !code.trim()
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-gradient-to-r from-brand-500 to-amber-400 text-white shadow-glow-gold hover:shadow-glow-gold/50 hover:-translate-y-px'
              )}
            >
              <Play className={cn('h-4 w-4', running && 'animate-spin')} />
              {running ? 'Running...' : 'Run Code'}
            </button>

            {/* Output */}
            {output && (
              <div className="rounded-xl border border-border overflow-hidden">
                <div className="code-block-header">
                  <span className="text-xs text-emerald-400 font-medium">Output</span>
                </div>
                <pre className="p-5 bg-muted/20 text-sm font-mono text-foreground/80 whitespace-pre-wrap leading-relaxed">
                  {output}
                </pre>
              </div>
            )}
          </div>

          {/* Right sidebar — quick reference */}
          <aside className="flex flex-col gap-5">
            {lang === 'dax' ? (
              <>
                <div className="rounded-xl border border-brand-500/20 bg-brand-500/5 p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-brand-500" /> DAX Quick Reference
                  </h3>
                  <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground">
                    {['CALCULATE(expr, filter)', 'FILTER(table, condition)', 'SUMX(table, expr)', 'RELATED(column)', 'DIVIDE(num, denom)', 'DATEADD(dates, n, interval)', 'DATESYTD(dates)', 'ALL(table|column)', 'ALLEXCEPT(table, col)', 'RANKX(table, expr)'].map((fn) => (
                      <div key={fn} className="rounded bg-muted/60 px-2 py-1">{fn}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-sm mb-2">Keyboard Shortcuts</h3>
                  <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <div className="flex justify-between"><span>Run code</span><kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">Ctrl+Enter</kbd></div>
                    <div className="flex justify-between"><span>Copy all</span><kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">Ctrl+A, C</kbd></div>
                    <div className="flex justify-between"><span>Reset</span><kbd className="font-mono bg-muted px-1.5 py-0.5 rounded">Ctrl+Z</kbd></div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-navy-500/20 bg-navy-500/5 p-5">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-navy-400" /> M Quick Reference
                  </h3>
                  <div className="flex flex-col gap-2 text-xs font-mono text-muted-foreground">
                    {['Table.SelectRows(t, cond)', 'Table.TransformColumns(t, ops)', 'Table.Group(t, keys, aggs)', 'Table.ExpandRecordColumn()', 'List.Transform(list, fn)', 'List.Select(list, cond)', 'Text.Combine(list, sep)', 'Date.From(value)', 'Number.From(text)', 'Record.Field(record, key)'].map((fn) => (
                      <div key={fn} className="rounded bg-muted/60 px-2 py-1">{fn}</div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border p-5">
                  <h3 className="font-semibold text-sm mb-2">M Structure</h3>
                  <pre className="text-xs font-mono text-muted-foreground leading-relaxed bg-muted/40 rounded p-3">{`let\n  Step1 = expr1,\n  Step2 = transform(Step1),\n  Step3 = filter(Step2)\nin\n  Step3`}</pre>
                </div>
              </>
            )}
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
