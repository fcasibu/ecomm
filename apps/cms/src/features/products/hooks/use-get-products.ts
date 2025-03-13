"use client";

import useSWR from "swr";
import type { Result } from "@ecomm/lib/execute-operation";
import { createQueryString } from "@ecomm/lib/create-query-string";
import type { ProductDTO } from "@ecomm/services/products/product-dto";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetProducts = ({
  page,
  query,
  pageSize,
}: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  const { data, isLoading } = useSWR<
    Result<{ products: ProductDTO[]; count: number }>
  >(
    `/api/products${createQueryString("", { page: page?.toString(), query, pageSize: pageSize?.toString() })}`,
    fetcher,
  );

  return {
    result: data!,
    isLoading,
  };
};
