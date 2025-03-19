'use client';

import { createI18nClient } from 'next-international/client';

export const {
  useI18n,
  useScopedI18n,
  useCurrentLocale,
  I18nProviderClient,
  useChangeLocale,
} = createI18nClient({
  'en-US': () => import('./dictionaries/en-US'),
});
