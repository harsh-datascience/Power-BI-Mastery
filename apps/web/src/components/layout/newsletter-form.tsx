'use client'

import { useState } from 'react'

export function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    // Wire to your email provider (Resend, Mailchimp, ConvertKit, ...)
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 h-9 rounded-lg border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          required
        />
        <button
          type="submit"
          className="h-9 rounded-lg bg-gradient-to-r from-brand-500 to-amber-400 px-4 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          Subscribe
        </button>
      </form>
      <p className="text-xs text-muted-foreground">
        {submitted ? '✅ Thanks! Check your inbox to confirm.' : 'No spam. Unsubscribe anytime.'}
      </p>
    </>
  )
}
