'use client';

import { useStorage } from '@/hooks/use-storage';
import { storageKeys } from '@/lib/constants/storage-keys';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { useGetProductsBySkus } from '../hooks/use-get-products-by-skus';
import { dynamicImport } from '@/lib/utils/dynamic-import';
import { Heading } from '@ecomm/ui/typography';
import { ImageComponent } from '@ecomm/ui/image';
import { Skeleton } from '@ecomm/ui/skeleton';
import { LazyLoader } from '@/components/lazy-loader';
import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';

const CarouselComponents = dynamicImport(
  () => import('@ecomm/ui/carousel'),
  {
    Carousel: {
      loading: () => <RecentlyViewedProductsSkeleton />,
    },
    CarouselItem: null,
    CarouselNext: null,
    CarouselPrevious: null,
    CarouselContent: {
      loading: () => <QueriedProductsSkeleton />,
    },
  },
  { ssr: false },
);

export function RecentlyViewedProducts({ sku }: { sku: string }) {
  const locale = useCurrentLocale();
  const recentlyViewedProductSkus = useStorage(
    storageKeys.recentlyViewedProducts(locale),
  );
  const t = useScopedI18n('recentlyViewedProducts');

  const skus = (
    recentlyViewedProductSkus?.map((sku) => sku.value) ?? []
  ).filter((skuInStorage) => skuInStorage !== sku);

  return (
    <LazyLoader skeleton={<RecentlyViewedProductsSkeleton />}>
      <CarouselComponents.Carousel
        className="container relative"
        opts={{ active: skus.length > 1 }}
      >
        <div className="flex items-start justify-between">
          {Boolean(skus.length) && (
            <Heading as="h2" className="mb-6 text-lg">
              {t('title')}
            </Heading>
          )}
          {skus.length > 1 && (
            <div className="flex gap-2">
              <CarouselComponents.CarouselPrevious relative />
              <CarouselComponents.CarouselNext relative />
            </div>
          )}
        </div>
        <QueriedProducts skus={skus} />
      </CarouselComponents.Carousel>
    </LazyLoader>
  );
}

const MAX_SKELETON_ITEMS = 7;

function QueriedProductsSkeleton() {
  const skeletonItems = Array.from({
    length: MAX_SKELETON_ITEMS,
  });

  return (
    <div className="-ml-3 flex overflow-hidden">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="flex aspect-square min-w-0 shrink-0 grow-0 basis-[200px] flex-col gap-2 pl-3"
        >
          <div className="overflow-hidden rounded-md">
            <Skeleton className="aspect-square h-[186px] w-[186px]" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentlyViewedProductsSkeleton() {
  const t = useScopedI18n('recentlyViewedProducts');

  return (
    <div className="container">
      <Heading as="h2" className="mb-6 text-lg">
        {t('title')}
      </Heading>
      <QueriedProductsSkeleton />
    </div>
  );
}

function QueriedProducts({ skus }: { skus: string[] }) {
  const { result, isLoading } = useGetProductsBySkus(skus);

  if (isLoading) return <QueriedProductsSkeleton />;

  if (!result.data?.length) return null;

  return (
    <CarouselComponents.CarouselContent className="-ml-3">
      {result.data.map((product) => (
        <CarouselComponents.CarouselItem
          key={product.id}
          className="basis-[200px] pl-3"
        >
          <NextLink
            href={link.product.single(product.name, product.sku)}
            className="flex aspect-square flex-col gap-2 hover:no-underline"
            prefetch
          >
            <div className="overflow-hidden rounded-md">
              <ImageComponent
                alt={product.name}
                src={product.image}
                width={200}
                height={200}
                className="aspect-square object-cover"
                quality={30}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs">{product.name}</span>
              <span className="text-xs font-bold">{product.price}</span>
            </div>
          </NextLink>
        </CarouselComponents.CarouselItem>
      ))}
    </CarouselComponents.CarouselContent>
  );
}
