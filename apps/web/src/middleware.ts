import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest } from 'next/server';
import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from './lib/utils/locale-helper';

const I18nMiddleware = createI18nMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|static|.*\\..*|_next|favicon.ico|robots.txt).*)'],
};
