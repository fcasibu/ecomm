'use client';

import { dynamicImport } from '@/lib/utils/dynamic-import';
import { LazyLoader } from '../lazy-loader';
import { useGetCategoryProductNewArrivals } from '@/features/products/hooks/use-get-category-product-new-arrivals';
import { Heading } from '@ecomm/ui/typography';
import {
  DefaultProductCarouselContent,
  DefaultProductCarouselContentSkeleton,
} from '../carousels/default-product-carousel';
import type { CategoryNewArrivalsCarousel } from '@/sanity/queries/content-page/types';
import { useScopedI18n } from '@/locales/client';

const CarouselComponents = dynamicImport(
  () => import('@ecomm/ui/carousel'),
  {
    Carousel: {
      loading: () => <NewArrivalsCarouselSkeleton />,
    },
  },
  { ssr: false },
);

export function CategoryProductNewArrivals({
  data,
}: {
  data: CategoryNewArrivalsCarousel;
}) {
  return (
    <LazyLoader skeleton={<NewArrivalsCarouselSkeleton />}>
      <NewArrivalsCarousel categoryId={data.categoryId} />
    </LazyLoader>
  );
}

function NewArrivalsCarousel({ categoryId }: { categoryId: string }) {
  const { result, isLoading } = useGetCategoryProductNewArrivals(categoryId);
  const t = useScopedI18n('categoryProductNewArrivals');

  if (isLoading) return <NewArrivalsCarouselSkeleton />;

  if ((result.success && !result.data?.length) || !result.success) return null;

  const products = result.success ? result.data : [];

  return (
    <CarouselComponents.Carousel
      className="container relative"
      opts={{
        active: products.length > 1,
      }}
    >
      <div className="flex items-start justify-between">
        {Boolean(products.length) && (
          <Heading as="h2" className="mb-6 text-lg">
            {t('title')}
          </Heading>
        )}
        {products.length > 1 && (
          <div className="flex gap-2">
            <CarouselComponents.CarouselPrevious relative />
            <CarouselComponents.CarouselNext relative />
          </div>
        )}
      </div>
      <DefaultProductCarouselContent products={products} />
    </CarouselComponents.Carousel>
  );
}

function NewArrivalsCarouselSkeleton() {
  const t = useScopedI18n('categoryProductNewArrivals');

  return (
    <div className="container">
      <Heading as="h2" className="mb-6 text-lg">
        {t('title')}
      </Heading>
      <DefaultProductCarouselContentSkeleton />
    </div>
  );
}
