'use client';

import useSWR from 'swr';
import type { Result } from '@ecomm/lib/execute-operation';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetNonRootCategories = () => {
  const { data, isLoading } = useSWR<Result<CategoryDTO[]>>(
    '/api/non-root-categories',
    fetcher,
  );

  return {
    result: data!,
    isLoading,
  };
};
