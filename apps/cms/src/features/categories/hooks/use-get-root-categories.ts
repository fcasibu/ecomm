import useSWR from "swr";
import type { Category } from "@ecomm/services/categories/categories-controller";
import type { Result } from "@ecomm/lib/execute-operation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useGetRootCategories = () => {
  const { data, isLoading } = useSWR<Result<Category[]>>(
    "/api/root-categories",
    fetcher,
  );

  return {
    result: data!,
    isLoading,
  };
};
