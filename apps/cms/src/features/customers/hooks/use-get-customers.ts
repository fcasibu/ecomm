'use client';

import useSWR from 'swr';
import type { Result } from '@ecomm/lib/execute-operation';
import { createQueryString } from '@ecomm/lib/create-query-string';
import type { CustomerDTO } from '@ecomm/services/customers/customer-dto';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetCustomers = ({
  page,
  query,
  pageSize,
}: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  const { data, isLoading } = useSWR<
    Result<{ customers: CustomerDTO[]; count: number }>
  >(
    `/api/customers${createQueryString('', { page: page?.toString(), query, pageSize: pageSize?.toString() })}`,
    fetcher,
  );

  return {
    result: data!,
    isLoading,
  };
};
