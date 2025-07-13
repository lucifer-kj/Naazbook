import { NextRequest, NextResponse } from 'next/server';

const CSRF_HEADER = 'x-csrf-token';
const CSRF_COOKIE = '__Host-next-auth.csrf-token';

export function middleware(req: NextRequest) {
  // Set security headers for all responses
  const res = NextResponse.next();
  res.headers.set('X-Frame-Options', 'SAMEORIGIN');
  res.headers.set('X-Content-Type-Options', 'nosniff');
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()');
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  // Only check CSRF for sensitive API routes
  if (
    ((req.nextUrl.pathname.startsWith('/api/order') || req.nextUrl.pathname.startsWith('/api/user')) &&
      (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE'))
  ) {
    const csrfHeader = req.headers.get(CSRF_HEADER);
    const csrfCookie = req.cookies.get(CSRF_COOKIE)?.value;
    if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
      return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 });
    }
  }

  return res;
}

export const config = {
  matcher: ['/api/order/:path*', '/api/user/:path*', '/dashboard/:path*'],
}; 