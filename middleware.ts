import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });

    // Refresh session if expired - required for Server Components
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if we're on a protected route
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/profile') || 
                            req.nextUrl.pathname.startsWith('/dashboard');

    // If accessing a protected route without a session, redirect to login
    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/login', req.url);
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // If accessing login/register while logged in, redirect to profile
    if ((req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') && session) {
      return NextResponse.redirect(new URL('/profile', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // In case of error, allow the request to continue
    return NextResponse.next();
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/profile/:path*',
    '/dashboard/:path*',
    '/login',
    '/register',
  ],
}; 