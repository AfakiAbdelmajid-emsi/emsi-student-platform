// src/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  // Define your public and protected paths
  const publicPaths = ['/login', '/register', '/callback' ,'/confirm-email'];
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));
  const isProfileCompletionPath = pathname.startsWith('/complete-profile');

  // Helper to mark no caching so middleware re-runs on every navigation
  const noCache = (res: NextResponse) => {
    res.headers.set('x-middleware-cache', 'no-cache');
    return res;
  };

  if (isPublicPath) {
    // If already logged in, redirect away from auth pages
    if (accessToken && ['/login', '/register'].includes(pathname)) {
      return noCache(NextResponse.redirect(new URL('/', request.url)));
    }
    return noCache(NextResponse.next());
  }

  // Not logged in → force to login
  if (!accessToken) {
    return noCache(NextResponse.redirect(new URL('/login', request.url)));
  }

  try {
    const [, payloadB64] = accessToken.split('.');
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());

    const profileComplete =
      payload.profile_complete === true ||
      payload.user_metadata?.profile_complete === true;

    // Completed but on completion page → go home
    if (profileComplete && isProfileCompletionPath) {
      return noCache(NextResponse.redirect(new URL('/courses', request.url)));
    }

    // Incomplete and NOT on completion → force to complete
    if (!profileComplete && !isProfileCompletionPath) {
      return noCache(
        NextResponse.redirect(new URL('/complete-profile', request.url))
      );
    }

    // Otherwise just proceed
    return noCache(NextResponse.next());
  } catch {
    // If token malformed, clear and force login
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    return noCache(res);
  }
}

export const config = {
  // adjust matcher to include your protected routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|api).*)'],
};
