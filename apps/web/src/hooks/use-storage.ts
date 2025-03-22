'use client';

import type { StorageKeys, StorageValues } from '@/lib/constants/storage-keys';
import { storage } from '@/lib/utils/storage';
import type { StorageType } from '@/types';
import { useEffect, useState } from 'react';

declare global {
  interface Document {
    addEventListener(
      type: `storage_${StorageKeys}_set` | `storage_${StorageKeys}_remove`,
      listener: (event: CustomEvent) => void,
      options?: boolean | AddEventListenerOptions,
    ): void;
  }
}
export function useStorage<T extends StorageKeys>(
  key: T,
  type: StorageType = 'localStorage',
) {
  const [state, setState] = useState<StorageValues[T] | null>(() => {
    if (typeof window === 'undefined') return null;

    return storage.get(key);
  });

  useEffect(() => {
    const abortController = new AbortController();
    const handleSetEvent = (event: CustomEvent) => {
      setState(event.detail);
    };

    const handleRemoveEvent = () => {
      setState(null);
    };

    document.addEventListener(`storage_${key}_set`, handleSetEvent);
    document.addEventListener(`storage_${key}_remove`, handleRemoveEvent);

    return () => {
      abortController.abort();
    };
  }, [key, type]);

  return state;
}
