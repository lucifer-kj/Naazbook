export const runtime = "nodejs";
import NextAuth from "next-auth"
import { prisma } from "@/lib/prisma"
import CredentialsProvider from "next-auth/providers/credentials"
import { compare } from "bcryptjs"

// Enhanced types for better type safety
interface ExtendedUser {
  id: string
  email: string
  name: string | null
  role: string
  lastLogin?: string
}

interface ExtendedToken {
  id: string
  role: string
  lastLogin?: string
  error?: string
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials: any): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await compare(credentials.password, user.password as string)

          if (!isPasswordValid) {
            return null
          }

          // Update last login
          // await prisma.user.update({
          //   where: { id: user.id },
          //   data: { lastLogin: new Date() }
          // })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastLogin: new Date().toISOString()
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.lastLogin = new Date().toISOString();
        // Session fingerprinting: hash user-agent if available and is a string
        let userAgent: string | undefined = undefined;
        if (typeof window !== 'undefined' && typeof window.navigator.userAgent === 'string') {
          userAgent = window.navigator.userAgent;
        } else if (account?.userAgent && typeof account.userAgent === 'string') {
          userAgent = account.userAgent;
        }
        if (userAgent) {
          const encoder = new TextEncoder();
          const data = encoder.encode(userAgent);
          token.fingerprint = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        }
      }
      // Expiry check (NextAuth handles exp, but add custom error for demo)
      if (token.exp && Date.now() > token.exp * 1000) {
        return { ...token, error: "SessionExpired" };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.error) {
        throw new Error("Session expired");
      }
      if (token) {
        (session.user as any).role = token.role as string;
        (session.user as any).id = token.id as string;
        (session.user as any).lastLogin = token.lastLogin as string;
        (session.user as any).fingerprint = token.fingerprint as string;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60, // 30 days
      }
    },
    callbackUrl: {
      name: `__Secure-next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    },
    csrfToken: {
      name: `__Host-next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      }
    }
  }
}) 