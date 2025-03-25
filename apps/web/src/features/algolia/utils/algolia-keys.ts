import type { Locale } from '@ecomm/lib/locale-helper';

const ENVIRONMENT =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const algoliaKeys = {
  category: {
    index: (locale: Locale) => `${ENVIRONMENT}_categories_${locale}` as const,
  },
  product: {
    index: (locale: Locale) => `${ENVIRONMENT}_products_${locale}` as const,
  },
} as const;
