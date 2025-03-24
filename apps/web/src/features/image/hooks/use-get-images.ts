'use client';

import useSWR from 'swr';
import type { Result } from '@ecomm/lib/execute-operation';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetImages() {
  const { data, error, isLoading } = useSWR<Result<string[]>>(
    '/api/images',
    fetcher,
  );

  return {
    data,
    isLoading,
    error,
  };
}
