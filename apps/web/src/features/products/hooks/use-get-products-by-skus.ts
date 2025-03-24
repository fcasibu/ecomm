'use client';

import { createQueryString } from '@ecomm/lib/create-query-string';
import type { Result } from '@ecomm/lib/execute-operation';
import type { ProductDTO } from '@ecomm/services/products/product-dto';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetProductsBySkus(skus: string[]): {
  result: Result<ProductDTO[]>;
  isLoading: boolean;
} {
  const { data, error, isLoading } = useSWR<Result<ProductDTO[]>>(
    `/api/recently-viewed-products${createQueryString('', { skus: skus.join(',') })}`,
    fetcher,
  );

  const result: Result<ProductDTO[]> = data?.success
    ? { success: true, data: data.data }
    : { success: false, error: data?.error ?? error };

  return { result, isLoading };
}
