import type { NextAuthConfig } from 'next-auth'

// Edge-compatible auth config (no Prisma, no bcrypt)
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const protectedPaths = ['/dashboard', '/leads', '/pipeline', '/settings']
      const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path))

      if (isProtected) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.company = (user as any).company
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).company = token.company
      }
      return session
    },
  },
  providers: [],
  session: { strategy: 'jwt' },
  secret: process.env.AUTH_SECRET,
}
