'use client';

import { createI18nClient } from 'next-international/client';

export const { useI18n, useScopedI18n, useCurrentLocale, I18nProviderClient } =
  createI18nClient({
    'en-US': () => import('./en-US'),
  });
