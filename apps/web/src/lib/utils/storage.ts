import 'client-only';
import type { StorageKeys, StorageValues } from '../constants/storage-keys';
import type { StorageType } from '@/types';

export const storage = {
  set: <T extends StorageKeys>(
    key: T,
    value: StorageValues[T],
    type: StorageType = 'localStorage',
  ) => {
    if (typeof window === 'undefined') return null;

    window[type].setItem(key, JSON.stringify(value));

    document.dispatchEvent(
      new CustomEvent(`storage_${key}_set`, {
        detail: value,
      }),
    );
  },

  get: <T extends StorageKeys>(
    key: T,
    type: StorageType = 'localStorage',
  ): StorageValues[T] | null => {
    if (typeof window === 'undefined') return null;

    const storageItem = window[type].getItem(key);

    if (!storageItem) return null;

    return JSON.parse(storageItem);
  },

  delete: (key: StorageKeys, type: StorageType = 'localStorage') => {
    if (typeof window === 'undefined') return null;

    window[type].removeItem(key);

    document.dispatchEvent(
      new CustomEvent(`storage_${key}_remove`, {
        detail: null,
      }),
    );
  },
} as const;
