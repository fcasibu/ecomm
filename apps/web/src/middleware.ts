import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@ecomm/lib/locale-helper';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';

const I18nMiddleware = createI18nMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export async function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
