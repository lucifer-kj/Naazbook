
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'experimental-edge';

export function middleware(request: NextRequest) {
  // Example: Only read cookies
  const csrfCookie = request.cookies.get('__Host-next-auth.csrf-token')?.value;

  // Simple redirect if CSRF cookie is missing (customize as needed)
  if (!csrfCookie) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/user/:path*',
    '/api/order/:path*',
    '/api/products/[slug]/reviews/:path*',
    '/dashboard/:path*',
    '/admin/:path*', // for future admin dashboard
  ],
}; 