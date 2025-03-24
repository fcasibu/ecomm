'use client';

import { useStorage } from '@/hooks/use-storage';
import { storageKeys } from '@/lib/constants/storage-keys';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { useGetProductsBySkus } from '../hooks/use-get-products-by-skus';
import { dynamicImport } from '@/lib/utils/dynamic-import';
import { Heading } from '@ecomm/ui/typography';
import { LazyLoader } from '@/components/lazy-loader';
import {
  DefaultProductCarouselContent,
  DefaultProductCarouselContentSkeleton,
} from '@/components/carousels/default-product-carousel';

const CarouselComponents = dynamicImport(
  () => import('@ecomm/ui/carousel'),
  {
    Carousel: {
      loading: () => <RecentlyViewedProductsSkeleton />,
    },
    CarouselNext: null,
    CarouselPrevious: null,
  },
  { ssr: false },
);

export function RecentlyViewedProducts({ sku }: { sku?: string }) {
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

function RecentlyViewedProductsSkeleton() {
  const t = useScopedI18n('recentlyViewedProducts');

  return (
    <div className="container">
      <Heading as="h2" className="mb-6 text-lg">
        {t('title')}
      </Heading>
      <DefaultProductCarouselContentSkeleton />
    </div>
  );
}

function QueriedProducts({ skus }: { skus: string[] }) {
  const { result, isLoading } = useGetProductsBySkus(skus);

  if (isLoading) return <DefaultProductCarouselContentSkeleton />;

  if ((result.success && !result.data?.length) || !result.success) return null;

  return <DefaultProductCarouselContent products={result.data} />;
}
