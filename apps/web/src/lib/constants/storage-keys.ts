import { toUnderscoreLocale, type Locale } from '@ecomm/lib/locale-helper';

export interface StorageValues {
  [key: `recently_viewed_products_${string}`]: {
    value: string;
    timestamp: number;
  }[];
}

export type StorageKeys = ReturnType<
  (typeof storageKeys)[keyof typeof storageKeys]
>;

export const storageKeys = {
  recentlyViewedProducts: (locale: Locale) =>
    `recently_viewed_products_${toUnderscoreLocale(locale)}` as const,
} as const;
