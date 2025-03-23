import useSWRInfinite from 'swr/infinite';
import type { Result } from '@ecomm/lib/execute-operation';

export const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetInfiniteImages() {
  const getKey = (
    _: number,
    previousPageData: Result<{ nextCursor: string; images: string[] }>,
  ) => {
    if (previousPageData && !previousPageData.success) return null;
    const cursor = previousPageData?.success
      ? previousPageData.data.nextCursor
      : undefined;

    return cursor ? `/api/images?cursor=${cursor}` : `/api/images`;
  };

  const { data, error, size, setSize } = useSWRInfinite<
    Result<{ nextCursor: string; images: string[] }>
  >(getKey, fetcher);

  const images =
    data?.flatMap((page) => (page.success ? page.data.images : [])) || [];
  const isLoading = !data && !error;
  const end = data?.at(-1);
  const isReachingEnd = end?.success && !end.data.nextCursor;

  return {
    images,
    isLoading,
    error,
    loadMore: () => setSize(size + 1),
    isReachingEnd,
  };
}
