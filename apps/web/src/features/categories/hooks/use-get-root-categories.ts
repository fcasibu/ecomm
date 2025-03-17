import useSWR from 'swr';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import type { Result } from '@ecomm/lib/execute-operation';
import { createQueryString } from '@ecomm/lib/create-query-string';
import { useCurrentLocale } from '@/locales/client';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetRootCategories() {
  const locale = useCurrentLocale();

  const { data, error, isLoading } = useSWR<Result<CategoryDTO[]>>(
    `/api/root-categories${createQueryString('', { locale })}`,
    fetcher,
  );

  return {
    data,
    isLoading,
    error,
  };
}
