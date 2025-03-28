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

export function ProductHitFullCard({
  product,
  imageLoadingStrategy,
}: {
  product: AlgoliaProductHit;
  imageLoadingStrategy: Pick<
    CustomImageProps,
    'loading' | 'fetchPriority'
  > | null;
}) {
  const { name, image, price, description, sku } = product;
  const t = useScopedI18n('productListing.productCard');

  return (
    <NextLink
      href={link.product.single(name, sku)}
      className="hover:no-underline"
    >
      <div className="border-input flex gap-4 rounded-lg border p-3 transition-all hover:border-black/50">
        <ImageComponent
          src={image}
          alt={name}
          width={200}
          height={200}
          className="aspect-square overflow-hidden rounded-lg object-cover"
          quality={50}
          {...imageLoadingStrategy}
        />
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-2">
            <Heading as="h2" className="!text-sm !font-normal md:!text-lg">
              {name}
            </Heading>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
          <div className="mt-auto flex justify-between">
            <span className="text-sm font-bold">
              {formatPrice(price.value, price.currency)}
            </span>
            <div>
              <Button
                aria-label={t('wishlist.actions.add')}
                type="button"
                className="flex items-center gap-2 px-2"
                variant="outline"
              >
                <Heart aria-hidden />
                <span>{t('wishlist.title')}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </NextLink>
  );
}
