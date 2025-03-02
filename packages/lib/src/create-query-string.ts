import type { ReadonlyURLSearchParams } from "next/navigation";

export function createQueryString(
  search: string | ReadonlyURLSearchParams | URLSearchParams,
  params: Record<string, string | null>,
) {
  const searchParams = new URLSearchParams(search);
  Object.entries(params).forEach(([key, val]) => {
    if (!val) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, val);
    }
  });

  return `?${searchParams.toString()}`;
}
