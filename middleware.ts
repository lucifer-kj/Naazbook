
import { NextRequest, NextResponse } from 'next/server';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = '__Host-next-auth.csrf-token';

export { auth as middleware } from "@/auth"

export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/order/:path*',
    '/api/products/[slug]/reviews/:path*',
    '/dashboard/:path*',
    '/admin/:path*', // for future admin dashboard
  ],
}; 