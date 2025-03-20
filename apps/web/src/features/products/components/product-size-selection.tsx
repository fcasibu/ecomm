'use client';

import { useProductVariant } from '../providers/product-variant-provider';
import { useScopedI18n } from '@/locales/client';
import { Heading } from '@ecomm/ui/typography';
import { Button } from '@ecomm/ui/button';
import { useProductStore } from '../stores/product-store';
import { cn } from '@ecomm/ui/lib/utils';
import { useShallow } from 'zustand/shallow';

export function ProductSizeSelection() {
  const { allSizes } = useProductVariant();
  const { dispatch, selectedSize } = useProductStore(
    useShallow((s) => ({ dispatch: s.dispatch, selectedSize: s.selectedSize })),
  );
  const t = useScopedI18n('productDetail.sizeSelection');

  return (
    <div className="space-y-2">
      <Heading as="h2" className="!text-sm">
        {t('title')}
      </Heading>
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4">
        {allSizes.map((size) => (
          <Button
            key={size.value}
            disabled={size.isDisabled}
            type="button"
            variant={selectedSize === size.value ? 'default' : 'outline'}
            className={cn('relative', {
              'line-through': size.isDisabled,
            })}
            onClick={() =>
              dispatch({ type: 'SELECT_SIZE', payload: size.value })
            }
          >
            {size.value}
            {size.isDisabled && (
              <div className="bg-muted-foreground absolute left-1/2 top-1/2 h-[2px] w-full -translate-x-1/2 -translate-y-1/2 -rotate-[15deg]" />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
}
