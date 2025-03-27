'use client';

import { useStore } from '@/features/store/providers/store-provider';
import { updateItemDeliveryPromiseAction } from '@/lib/actions/cart';
import { formatDateRange } from '@/lib/utils/date';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import type { CartItemDTO } from '@ecomm/services/cart/cart-dto';
import { Badge } from '@ecomm/ui/badge';
import { Label } from '@ecomm/ui/label';
import { RadioGroup, RadioGroupItem } from '@ecomm/ui/radio';
import { useTransition } from 'react';

export function ShippingMethods({
  subtotal,
  item,
}: {
  subtotal: number;
  item: CartItemDTO;
}) {
  const t = useScopedI18n('cart.shippingMethod');
  const store = useStore();
  const [isPending, startTransition] = useTransition();

  if (!item.deliveryPromises.length) return null;

  const priceNeeded = Math.max(store.freeShippingThreshold - subtotal, 0);

  const defaultDeliveryPromise = item.deliveryPromises.find(
    (dp) => dp.selected,
  );

  return (
    <div className="mt-3 flex flex-col gap-2">
      <p className="text-sm">{t('title')}</p>
      <RadioGroup
        className="flex flex-col gap-3"
        defaultValue={defaultDeliveryPromise?.shippingMethod}
        onValueChange={(value) => {
          const selectedDeliveryPromise = item.deliveryPromises.find(
            (dp) => dp.shippingMethod === value,
          );

          if (selectedDeliveryPromise) {
            startTransition(async () => {
              await updateItemDeliveryPromiseAction(null, {
                itemId: item.id,
                deliveryPromiseId: selectedDeliveryPromise.id,
              });
            });
          }
        }}
      >
        {item.deliveryPromises
          .toSorted((a, b) => a.price - b.price)
          .map((dp) => {
            const startDate =
              new Date().getTime() + dp.estimatedMinDays * 24 * 60 * 60 * 1000;
            const endDate =
              new Date().getTime() + dp.estimatedMaxDays * 24 * 60 * 60 * 1000;

            const isNextDay = dp.shippingMethod === 'NEXT_DAY';
            const tomorrow = new Date(startDate + 24 * 60 * 60 * 1000);

            return (
              <div
                key={dp.shippingMethod}
                className="flex items-start justify-between"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value={dp.shippingMethod}
                    className="flex flex-col"
                    id={`${item.id}-${dp.shippingMethod}`}
                    disabled={isPending}
                  />
                  <Label
                    htmlFor={`${item.id}-${dp.shippingMethod}`}
                    className="flex cursor-pointer flex-col"
                  >
                    <span>
                      {dp.shippingMethod === 'NEXT_DAY'
                        ? t('NEXT_DAY')
                        : t(dp.shippingMethod, {
                            min: dp.estimatedMinDays,
                            max: dp.estimatedMaxDays,
                          })}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {t('estimatedDelivery', {
                        date: isNextDay
                          ? formatDateRange(
                              new Date(tomorrow),
                              new Date(tomorrow),
                            )
                          : formatDateRange(
                              new Date(startDate),
                              new Date(endDate),
                            ),
                      })}
                    </span>
                  </Label>
                </div>
                <div>
                  {dp.requiresShippingFee && (
                    <div className="flex flex-col text-right text-sm">
                      <span className="text-muted-foreground text-xs">
                        {t('notEligibleForFreeShipping')}
                      </span>
                      <span>{formatPrice(dp.price, store.currency)}</span>
                    </div>
                  )}
                  {!dp.requiresShippingFee && priceNeeded === 0 && (
                    <Badge variant="success">{t('free')}</Badge>
                  )}
                </div>
              </div>
            );
          })}
      </RadioGroup>
    </div>
  );
}
