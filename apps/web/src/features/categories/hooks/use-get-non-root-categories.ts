'use client';

import useSWR from 'swr';
import type { Result } from '@ecomm/lib/execute-operation';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetNonRootCategories(): {
  result: Result<CategoryDTO[]>;
  isLoading: boolean;
} {
  const { data, isLoading, error } = useSWR<Result<CategoryDTO[]>>(
    '/api/non-root-categories',
    fetcher,
  );

  const result: Result<CategoryDTO[]> = data?.success
    ? { success: true, data: data.data }
    : { success: false, error: data?.error ?? error };

  return {
    result,
    isLoading,
  };
}
