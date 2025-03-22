'use client';

import { MAX_RECENTLY_VIEWED_PRODUCTS_DAYS } from '@/lib/constants';
import { storageKeys } from '@/lib/constants/storage-keys';
import { storage } from '@/lib/utils/storage';
import { useCurrentLocale } from '@/locales/client';
import { useEffect } from 'react';

export function RecentlyViewedSetter({ sku }: { sku: string }) {
  const locale = useCurrentLocale();

  useEffect(() => {
    const now = new Date();
    const skus = storage.get(storageKeys.recentlyViewedProducts(locale));

    const filteredSkus =
      skus?.filter((visitedSku) => {
        const expireTime =
          MAX_RECENTLY_VIEWED_PRODUCTS_DAYS * 24 * 60 * 60 * 1000;

        return (
          visitedSku.timestamp - now.getTime() < expireTime &&
          visitedSku.value !== sku
        );
      }) ?? [];

    storage.set(storageKeys.recentlyViewedProducts(locale), [
      { value: sku, timestamp: now.getTime() },
      ...filteredSkus,
    ]);
  }, [locale, sku]);

  return null;
}
