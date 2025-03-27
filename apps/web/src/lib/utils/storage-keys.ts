import type { AlgoliaProductHit } from '@/features/algolia/types';
import { toUnderscoreLocale, type Locale } from '@ecomm/lib/locale-helper';

export interface StorageValues {
  [key: `recently_viewed_products_${string}`]: {
    value: string;
    timestamp: number;
  }[];

  [key: `recent_searches_${string}`]: AlgoliaProductHit[];
}

export type StorageKeys = ReturnType<
  (typeof storageKeys)[keyof typeof storageKeys]
>;

export const storageKeys = {
  recentlyViewedProducts: (locale: Locale) =>
    `recently_viewed_products_${toUnderscoreLocale(locale)}` as const,
  recentSearches: (locale: Locale) =>
    `recent_searches_${toUnderscoreLocale(locale)}` as const,
} as const;
