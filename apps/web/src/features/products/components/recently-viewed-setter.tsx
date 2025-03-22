'use client';

import { storageKeys } from '@/lib/constants/storage-keys';
import { storage } from '@/lib/utils/storage';
import { useCurrentLocale } from '@/locales/client';
import { useEffect } from 'react';

const EXPIRE_TIME_IN_MS = 10 * 24 * 60 * 60 * 1000;
const MAX_RECENTLY_VIEWED_PRODUCTS = 14;

export function RecentlyViewedSetter({ sku }: { sku: string }) {
  const locale = useCurrentLocale();

  useEffect(() => {
    const now = new Date();
    const skus = storage.get(storageKeys.recentlyViewedProducts(locale)) ?? [];

    const skuFilter = (visitedSku: { value: string; timestamp: number }) =>
      visitedSku.timestamp - now.getTime() < EXPIRE_TIME_IN_MS &&
      visitedSku.value !== sku;

    const filteredSkus = skus
      .filter(skuFilter)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, MAX_RECENTLY_VIEWED_PRODUCTS);

    filteredSkus.unshift({ value: sku, timestamp: now.getTime() });

    storage.set(storageKeys.recentlyViewedProducts(locale), filteredSkus);
  }, [locale, sku]);

  return null;
}
