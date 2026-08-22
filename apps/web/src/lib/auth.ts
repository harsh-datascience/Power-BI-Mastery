import NextAuth from 'next-auth'
import type { NextRequest } from 'next/server'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import AzureAD from 'next-auth/providers/azure-ad'

/**
 * NextAuth v5 configuration.
 *
 * To enable database persistence:
 *   1. Set DATABASE_URL in your environment
 *   2. pnpm --filter database db:push
 *   3. import { PrismaAdapter } from '@auth/prisma-adapter'
 *   4. add `adapter: PrismaAdapter(db)` and switch strategy to 'database'
 *
 * Currently uses JWT strategy so the portal works without a database.
 */
const nextAuth = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    AzureAD({
      clientId: process.env.MICROSOFT_CLIENT_ID ?? '',
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET ?? '',
      tenantId: process.env.MICROSOFT_TENANT_ID ?? 'common',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user
      const isProtected = nextUrl.pathname.startsWith('/dashboard')
      if (isProtected) return isLoggedIn
      return true
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

// Explicit type annotations avoid the NextAuth v5 beta "cannot be named" error.
export const handlers: {
  GET: (req: NextRequest) => Promise<Response>
  POST: (req: NextRequest) => Promise<Response>
} = nextAuth.handlers

// Access signIn / signOut / auth through this object in server components.
// Typed loosely because NextAuth v5 beta types are not portable across
// package boundaries in a pnpm workspace.
export const authApi = nextAuth as unknown as {
  signIn: (provider?: string, options?: Record<string, unknown>) => Promise<unknown>
  signOut: (options?: Record<string, unknown>) => Promise<unknown>
  auth: () => Promise<{ user?: { id?: string; name?: string; email?: string; image?: string } } | null>
}
