import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/layout/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://powerbimastery.com'

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Power BI Mastery – Master DAX & Power Query M Language',
    template: '%s | Power BI Mastery',
  },
  description:
    'The enterprise-grade learning portal for Power BI professionals. Master DAX formulas, Power Query M language, and advanced analytics patterns with interactive examples, guided learning paths, and a live code playground.',
  keywords: [
    'Power BI', 'DAX', 'Power Query', 'M Language', 'Data Analytics',
    'Business Intelligence', 'Learn DAX', 'Power Query tutorial',
    'CALCULATE', 'FILTER', 'measure', 'calculated column',
  ],
  authors: [{ name: 'Power BI Mastery' }],
  creator: 'Power BI Mastery',
  publisher: 'Power BI Mastery',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'Power BI Mastery',
    title: 'Power BI Mastery – Master DAX & Power Query M Language',
    description: 'The enterprise-grade learning portal for Power BI professionals.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Power BI Mastery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Power BI Mastery',
    description: 'The enterprise-grade learning portal for Power BI professionals.',
    images: ['/og-image.png'],
    creator: '@powerbimastery',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: { canonical: APP_URL },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1530' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>
      <body className="min-h-dvh bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
