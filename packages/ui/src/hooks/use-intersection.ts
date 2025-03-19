'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type RefCallback,
} from 'react';

export function useIntersectionObserver(
  options?: IntersectionObserverInit & { once?: boolean },
): [RefCallback<HTMLElement>, IntersectionObserverEntry | undefined] {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: HTMLElement) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (node) {
        observer.current = new IntersectionObserver(([newEntry], obs) => {
          setEntry(newEntry);

          if (newEntry?.isIntersecting && options?.once) {
            obs.disconnect();
          }
        }, options);
        observer.current.observe(node);
      }
    },
    [options],
  );

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return [ref, entry];
}
