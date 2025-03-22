'use client';

import { ImageComponent } from '@ecomm/ui/image';
import { useProductDetail } from '../providers/product-detail-provider';
import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';
import { CheckIcon } from 'lucide-react';
import { cn } from '@ecomm/ui/lib/utils';
import { useScopedI18n } from '@/locales/client';
import { useProductStore } from '../stores/product-store';
import { useShallow } from 'zustand/shallow';
import { Heading } from '@ecomm/ui/typography';

export function ProductVariantSelection() {
  const { product, selectedVariant } = useProductDetail();
  const { dispatch } = useProductStore(
    useShallow((s) => ({ dispatch: s.dispatch, selectedSize: s.selectedSize })),
  );
  const t = useScopedI18n('productDetail.variantSelection');

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Heading as="h2" className="!text-sm">
          {t('title')}
        </Heading>
        <span className="text-muted-foreground text-sm">
          {selectedVariant.attributes.color}
        </span>
      </div>
      <div className="flex gap-3">
        {product.variants.map((variant) => (
          <NextLink
            aria-label={t('alt', { sku: variant.sku })}
            key={variant.id}
            replace
            scroll={false}
            href={link.product.single(product.name, variant.sku)}
            className="hover:no-underline"
            onClick={() => {
              if (variant.id === selectedVariant.id) return;

              dispatch({
                type: 'SELECT_SIZE',
                payload: '',
              });
            }}
          >
            <div
              className={cn(
                'relative aspect-square overflow-hidden rounded-full',
                {
                  'outline-primary outline outline-offset-4':
                    selectedVariant.id === variant.id,
                },
              )}
            >
              <ImageComponent
                alt={product.name}
                src={variant.images[0]}
                width={75}
                height={75}
                quality={25}
                className="h-[75px] w-[75px] object-cover"
              />
              <CheckIcon
                className={cn(
                  'stroke-primary absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2',
                  {
                    block: selectedVariant.id === variant.id,
                  },
                )}
              />
            </div>
          </NextLink>
        ))}
      </div>
    </div>
  );
}
