'use client';

import { NextLink } from '@/components/link';
import type { AlgoliaProductHit } from '@/features/algolia/types';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import { Button } from '@ecomm/ui/button';
import { ImageComponent, type CustomImageProps } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';
import { Heart } from 'lucide-react';

export function ProductHitCard({
  product,
  imageLoadingStrategy,
}: {
  product: AlgoliaProductHit;
  imageLoadingStrategy: Pick<
    CustomImageProps,
    'loading' | 'fetchPriority'
  > | null;
}) {
  const { name, image, price, variants } = product;
  const t = useScopedI18n('productListing.productCard');

  const variantList = variants.slice(1, 3);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-lg">
        <NextLink href={link.product.single(name, product.sku)} prefetch>
          <ImageComponent
            src={image}
            alt={name}
            width={360}
            height={360}
            className="aspect-square w-full object-cover"
            quality={75}
            {...imageLoadingStrategy}
          />
        </NextLink>
        <Button
          aria-label={t('wishlist.actions.add')}
          type="button"
          className="absolute right-2 top-2 flex h-8 w-8 rounded-full bg-white p-3"
          variant="outline"
        >
          <Heart aria-hidden />
        </Button>
      </div>
      <div>
        <NextLink href={link.product.single(name, product.sku)}>
          <Heading as="h2" className="!text-sm !font-normal md:!text-lg">
            {product.name}
          </Heading>
        </NextLink>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold">
          {formatPrice(price.value, price.currency)}
        </span>
        <div className="flex gap-2">
          {variantList.map((variant) => (
            <ImageComponent
              key={variant.id}
              src={variant.image}
              alt={name}
              width={45}
              height={45}
              className="aspect-square overflow-hidden rounded-lg object-cover"
              quality={20}
            />
          ))}
          {variants.length - 1 > variantList.length && (
            <span className="text-xs font-bold">
              {t('variants.more', {
                count: variants.length - variantList.length - 1,
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
