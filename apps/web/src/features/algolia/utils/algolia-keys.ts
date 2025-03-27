import type { Locale } from '@ecomm/lib/locale-helper';

const ENVIRONMENT =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const algoliaKeys = {
  category: {
    index: (locale: Locale) => `${ENVIRONMENT}_categories_${locale}` as const,
  },
  product: {
    main: (locale: Locale) => `${ENVIRONMENT}_products_${locale}` as const,
    priceAsc: (locale: string) => `${ENVIRONMENT}_products_price_asc_${locale}`,
    priceDesc: (locale: string) =>
      `${ENVIRONMENT}_products_price_desc_${locale}`,
  },
} as const;
