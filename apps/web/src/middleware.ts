import { AVAILABLE_LOCALES, DEFAULT_LOCALE } from '@ecomm/lib/locale-helper';
import { createI18nMiddleware } from 'next-international/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { clientEnv } from './env/client';

const I18nMiddleware = createI18nMiddleware({
  locales: AVAILABLE_LOCALES,
  defaultLocale: DEFAULT_LOCALE,
});

export async function middleware(request: NextRequest) {
  const response = I18nMiddleware(request);
  const locale = response.headers.get('x-next-locale') ?? '';

  const noLocalePathname = request.nextUrl.pathname.replace(locale, '');
  if (noLocalePathname !== noLocalePathname.toLowerCase()) {
    return NextResponse.redirect(
      await getFriendlyDestination(request, locale),
      308,
    );
  }

  return response;
}

async function getFriendlyDestination(request: NextRequest, locale: string) {
  const pathname = request.nextUrl.pathname.replace(locale, '').toLowerCase();
  return `${clientEnv.NEXT_PUBLIC_STOREFRONT_BASE_URL}/${locale}${pathname}${request.nextUrl.search}`;
}

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
