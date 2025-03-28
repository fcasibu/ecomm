'use client';

import { useStore } from '@/features/store/providers/store-provider';
import { renderRichText } from '@/lib/utils/render-rich-text';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';

export function FreeShippingPriceThreshold({
  currentThreshold,
}: {
  currentThreshold: number;
}) {
  const store = useStore();
  const t = useScopedI18n('cart.shippingMethod');

  const priceNeeded = Math.max(
    store.freeShippingThreshold - currentThreshold,
    0,
  );
  const priceNeededPercentage = Math.min(
    (currentThreshold / store.freeShippingThreshold) * 100,
    100,
  );

  return (
    <div className="bg-primary/10 flex flex-col gap-2 rounded-lg p-4">
      <p className="text-xs">
        {renderRichText(
          t('addMoreForFreeShipping', {
            price: formatPrice(priceNeeded, store.currency),
          }),
          {
            bold: ({ children }) => <strong>{children}</strong>,
          },
        )}
      </p>
      <div className="relative flex flex-col gap-2">
        <div className="bg-primary/15 relative h-2 w-full rounded-full">
          <div
            className="bg-primary absolute h-full rounded-full"
            style={{ width: `${priceNeededPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="bottom-0 left-0">
            {formatPrice(currentThreshold, store.currency)}
          </span>
          <span className="bottom-0 right-0">
            {formatPrice(store.freeShippingThreshold, store.currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
