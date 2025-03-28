import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@ecomm/lib/locale-helper';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextResponse } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

const isProtectedRoute = createRouteMatcher(['/:locale/my-account(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isProtectedRoute(request)) await auth.protect();

  const pathname = request.nextUrl.pathname;

  if (!pathname.startsWith('/api') && !pathname.startsWith('/trpc')) {
    return I18nMiddleware(request);
  }
});

export const config = {
  matcher: ['/((?!_next|_vercel|.*\\..*).*)', '/(api|trpc)(.*)'],
};
