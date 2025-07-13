// lib/auth-guard.ts
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  role?: string;
}

/**
 * Throws or redirects if the user is not authenticated.
 * Returns the session if authenticated.
 */
export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    redirect('/auth/signin');
  }
  return session;
}

/**
 * Throws or redirects if the user does not have the required role.
 * Returns the session if authorized.
 */
export async function requireRole(role: string) {
  const session = await requireAuth();
  const user = session.user as AuthUser;
  if (user.role !== role) {
    redirect('/dashboard');
  }
  return session;
}

/**
 * Throws or redirects if the user is not an admin.
 * Returns the session if authorized.
 */
export async function requireAdmin() {
  return requireRole('admin');
}
