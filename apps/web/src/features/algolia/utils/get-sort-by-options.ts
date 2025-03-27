import type { Locale } from '@ecomm/lib/locale-helper';
import { algoliaKeys } from './algolia-keys';

export type SortByLabel = 'main' | 'priceAsc' | 'priceDesc';

export function getProductSortByOptions(locale: Locale) {
  return [
    { label: 'main', value: algoliaKeys.product.main(locale) },
    { label: 'priceAsc', value: algoliaKeys.product.priceAsc(locale) },
    { label: 'priceDesc', value: algoliaKeys.product.priceDesc(locale) },
  ];
}
