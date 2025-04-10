'use client';

import useSWR from 'swr';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import type { Result } from '@ecomm/lib/execute-operation';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetRootCategories(): {
  result: Result<CategoryDTO[]>;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useSWR<Result<CategoryDTO[]>>(
    `/api/root-categories`,
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
