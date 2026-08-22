import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { StatsSection } from '@/components/home/stats-section'
import { FeaturesSection } from '@/components/home/features-section'
import { LearningPathsSection } from '@/components/home/learning-paths-section'
import { CodeShowcaseSection } from '@/components/home/code-showcase-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { CtaSection } from '@/components/home/cta-section'
import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <LearningPathsSection />
        <CodeShowcaseSection />
        <Suspense fallback={null}>
          <TestimonialsSection />
        </Suspense>
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  )
}
