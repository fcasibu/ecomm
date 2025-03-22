import useSWR from 'swr';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import type { Result } from '@ecomm/lib/execute-operation';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetRootCategories() {
  const { data, error, isLoading } = useSWR<Result<CategoryDTO[]>>(
    `/api/root-categories`,
    fetcher,
  );

  return {
    data,
    isLoading,
    error,
  };
}
