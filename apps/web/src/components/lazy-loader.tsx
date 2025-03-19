'use client';

import { useIntersectionObserver } from '@ecomm/ui/hooks/use-intersection';

export function LazyLoader({
  skeleton: Skeleton,
  children,
}: {
  skeleton: React.ElementType;
  children: React.ReactNode;
}) {
  const [ref, entry] = useIntersectionObserver({ once: true });

  return <div ref={ref}>{entry?.isIntersecting ? children : <Skeleton />}</div>;
}
