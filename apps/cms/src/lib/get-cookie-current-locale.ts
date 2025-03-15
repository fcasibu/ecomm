import 'server-only';
import { cookies } from 'next/headers';
import { STORE_CURRENT_LOCALE_COOKIE_KEY } from '@/features/store/constants';

export async function getCookieCurrentLocale() {
  const cookie = await cookies();
  return cookie.get(STORE_CURRENT_LOCALE_COOKIE_KEY)?.value ?? 'en-US';
}
