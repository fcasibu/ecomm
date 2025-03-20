'use client';

import { dynamicImport } from '@/lib/utils/dynamic-import';
import { useDidMount } from '@ecomm/ui/hooks/use-did-mount';
import { ImageComponent } from '@ecomm/ui/image';
import { useProductDetail } from '../providers/product-detail-provider';
import { cn } from '@ecomm/ui/lib/utils';
import { useCarousel } from '@ecomm/ui/context/carousel-context';
import { Button } from '@ecomm/ui/button';
import { useScopedI18n } from '@/locales/client';

const CarouselComponents = dynamicImport(
  () => import('@ecomm/ui/carousel'),
  {
    Carousel: {
      loading: () => <ProductImageSkeleton />,
    },
    CarouselItem: null,
    CarouselNext: null,
    CarouselPrevious: null,
    CarouselContent: null,
  },
  { ssr: false },
);

export function ProductImage() {
  const { product, selectedVariant } = useProductDetail();
  const mounted = useDidMount();

  if (!mounted) return <ProductImageSkeleton />;

  return (
    <CarouselComponents.Carousel className="flex w-full flex-col gap-4">
      <div className="relative">
        <CarouselComponents.CarouselContent>
          {selectedVariant.images.map((image, index) => (
            <CarouselComponents.CarouselItem key={`${image}-${index}`}>
              <div className="relative aspect-square w-full overflow-hidden rounded-xl">
                <ImageComponent
                  alt={product.name}
                  src={image}
                  width={600}
                  height={600}
                  className="aspect-square w-full object-cover"
                  quality={80}
                />
              </div>
            </CarouselComponents.CarouselItem>
          ))}
        </CarouselComponents.CarouselContent>
        <CarouselComponents.CarouselPrevious className="left-[7px] shadow" />
        <CarouselComponents.CarouselNext className="right-[7px] shadow" />
      </div>
      <Thumbnails images={selectedVariant.images} />
    </CarouselComponents.Carousel>
  );
}

function Thumbnails({ images }: { images: string[] }) {
  // to ensure elements here not get memoized
  // since index === currentSlideIndex is not evaluating correctly
  'use no memo';

  const { api } = useCarousel();
  const t = useScopedI18n('productDetail.image.thumbnails');

  if (images.length <= 1) return null;

  const handleSelectThumbnail = (index: number) => {
    api?.scrollTo(index);
  };

  const currentSlideIndex = api?.internalEngine().index.get();

  return (
    <div className="grid grid-cols-5 gap-3">
      {images.map((image, index) => (
        <Button
          aria-label={t('actions.select', { index: index + 1 })}
          variant="none"
          type="button"
          key={`${image}-${index}`}
          onClick={() => handleSelectThumbnail(index)}
          className="block h-full w-full p-0"
        >
          <div
            className={cn(
              'ring-border relative aspect-square overflow-hidden rounded-xl ring-1',
              {
                'ring-2 ring-black ring-offset-2': index === currentSlideIndex,
              },
            )}
          >
            <ImageComponent
              alt={t('alt', { index: index + 1 })}
              src={image}
              className="aspect-square w-full object-cover"
              width={100}
              height={100}
              quality={25}
            />
          </div>
        </Button>
      ))}
    </div>
  );
}

function ProductImageSkeleton() {
  const { product, selectedVariant } = useProductDetail();
  const t = useScopedI18n('productDetail.image.thumbnails');

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl">
        <ImageComponent
          alt={product.name}
          src={selectedVariant.images[0]}
          width={600}
          height={600}
          className="aspect-square w-full object-cover"
          loading="eager"
          fetchPriority="high"
          quality={80}
        />
      </div>
      {selectedVariant.images.length > 1 && (
        <div className="grid grid-cols-5 gap-3">
          {selectedVariant.images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cn(
                'ring-border relative aspect-square overflow-hidden rounded-xl ring-1',
                {
                  'ring-2 ring-black ring-offset-2': index === 0,
                },
              )}
            >
              <ImageComponent
                alt={t('alt', { index: index + 1 })}
                src={image}
                className="aspect-square w-full object-cover"
                width={100}
                height={100}
                quality={25}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
