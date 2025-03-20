'use client';

import type { LinkProps } from 'next/link';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { Slot } from '@ecomm/ui/slot';
import { cn } from '@ecomm/ui/lib/utils';
import { useCurrentLocale } from '@/locales/client';

type PrefetchImage = {
  srcset: string;
  sizes: string;
  src: string;
  alt: string;
  loading: string;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function prefetchImages(href: string) {
  if (!href.startsWith('/') || href === '/') {
    return [];
  }

  const url = new URL(href, window.location.href);

  try {
    const imageResponse = await fetch(`/api/prefetch-images/${url.pathname}`, {
      priority: 'low',
    });

    if (!imageResponse.ok) {
      return [];
    }
    const { images } = await imageResponse.json();
    return images as PrefetchImage[];
  } catch {
    return [];
  }
}

const seen = new Set<string>();
const imageCache = new Map<string, PrefetchImage[]>();

interface NextLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  newTab?: boolean;
}

export const NextLink = ({
  children,
  className,
  newTab,
  ...props
}: NextLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const locale = useCurrentLocale();
  const href = String(props.href).startsWith('/')
    ? `/${locale}${props.href}`
    : String(props.href);

  useEffect(() => {
    if (!props.prefetch || newTab) return;

    const linkElement = linkRef.current;
    if (!linkElement) return;

    let prefetchTimeout: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          prefetchTimeout = setTimeout(async () => {
            router.prefetch(href);
            await sleep(0);

            if (!imageCache.has(href)) {
              prefetchImages(href).then((images) => {
                if (!images.length) return;

                imageCache.set(href, images ?? []);
              }, console.error);
            }

            observer.unobserve(entry.target);
          }, 300);
        } else if (prefetchTimeout) {
          clearTimeout(prefetchTimeout);
          prefetchTimeout = null;
        }
      },
      { rootMargin: '0px', threshold: 0.1 },
    );

    observer.observe(linkElement);

    return () => {
      observer.disconnect();
      if (prefetchTimeout) {
        clearTimeout(prefetchTimeout);
      }
    };
  }, [href, props.prefetch, router, newTab]);

  return (
    <Link
      {...props}
      ref={linkRef}
      prefetch={false}
      className={cn('underline-offset-4 hover:underline', className)}
      {...(newTab && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      onMouseEnter={() => {
        if (newTab) return;

        router.prefetch(href);
        const images = imageCache.get(href) || [];

        for (const image of images) {
          prefetchImage(image);
        }
      }}
      onClick={(e) => {
        if (newTab) return;

        const url = new URL(href, window.location.href);

        if (
          url.origin === window.location.origin &&
          e.button === 0 &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          e.preventDefault();
          props.onClick?.(e);

          if (props.replace) {
            router.replace(href);
          } else {
            router.push(href);
          }
        }
      }}
      href={href}
    >
      {children}
    </Link>
  );
};

export const ConditionalLink = ({
  children,
  href,
  prefetch,
  ...props
}: Omit<NextLinkProps, 'href'> & {
  href: LinkProps['href'] | null | undefined;
}) => {
  if (!href) return <Slot {...props}>{children}</Slot>;

  return (
    <NextLink prefetch={prefetch} href={href} {...props}>
      {children}
    </NextLink>
  );
};

function prefetchImage(image: PrefetchImage) {
  if (image.loading === 'lazy' || seen.has(image.srcset)) {
    return;
  }
  const img = new Image();
  img.decoding = 'async';
  img.fetchPriority = 'low';
  img.sizes = image.sizes;
  seen.add(image.srcset);
  img.srcset = image.srcset;
  img.src = image.src;
  img.alt = image.alt;
}
