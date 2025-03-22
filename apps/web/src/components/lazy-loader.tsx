'use client';

import { useIntersectionObserver } from '@ecomm/ui/hooks/use-intersection';

export function LazyLoader({
  skeleton,
  children,
}: {
  skeleton: React.ReactNode;
  children: React.ReactNode;
}) {
  const [ref, entry] = useIntersectionObserver({ once: true });

  return <div ref={ref}>{entry?.isIntersecting ? children : skeleton}</div>;
}
