"use client";

import useSWR from "swr";
import type { Result } from "@ecomm/lib/execute-operation";
import { createQueryString } from "@ecomm/lib/create-query-string";
import type { CategoryDTO } from "@ecomm/services/categories/category-dto";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetCategories = ({
  page,
  query,
  pageSize,
}: {
  page?: number;
  query?: string;
  pageSize?: number;
}) => {
  const { data, isLoading } = useSWR<
    Result<{ categories: CategoryDTO[]; count: number }>
  >(
    `/api/categories${createQueryString("", { page: page?.toString(), query, pageSize: pageSize?.toString() })}`,
    fetcher,
  );

  return {
    result: data!,
    isLoading,
  };
};
