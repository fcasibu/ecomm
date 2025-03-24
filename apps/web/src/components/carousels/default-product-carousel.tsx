import { dynamicImport } from '@/lib/utils/dynamic-import';
import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { Skeleton } from '@ecomm/ui/skeleton';
import { NextLink } from '../link';
import { link } from '@/lib/utils/link-helper';
import { ImageComponent } from '@ecomm/ui/image';
import { formatPrice } from '@ecomm/lib/format-price';

const CarouselComponents = dynamicImport(
  () => import('@ecomm/ui/carousel'),
  {
    CarouselItem: null,
    CarouselNext: null,
    CarouselPrevious: null,
    CarouselContent: {
      loading: () => <DefaultProductCarouselContentSkeleton />,
    },
  },
  { ssr: false },
);

export function DefaultProductCarouselContent({
  products,
}: {
  products: ProductDTO[];
}) {
  return (
    <CarouselComponents.CarouselContent className="-ml-3">
      {products.map((product) => {
        const variant = product.variants[0];

        return (
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
                  src={variant?.images[0]}
                  width={200}
                  height={200}
                  className="aspect-square object-cover"
                  quality={30}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs">{product.name}</span>
                {variant?.price && (
                  <span className="text-xs font-bold">
                    {formatPrice(variant.price.value, variant.price.currency)}
                  </span>
                )}
              </div>
            </NextLink>
          </CarouselComponents.CarouselItem>
        );
      })}
    </CarouselComponents.CarouselContent>
  );
}

const MAX_SKELETON_ITEMS = 7;

export function DefaultProductCarouselContentSkeleton() {
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
