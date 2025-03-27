'use client';

import { NextLink } from '@/components/link';
import { useStore } from '@/features/store/providers/store-provider';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import type { CartDTO } from '@ecomm/services/cart/cart-dto';
import { Badge } from '@ecomm/ui/badge';
import { Button } from '@ecomm/ui/button';
import { Heading } from '@ecomm/ui/typography';
import { CheckCircle, Lock, Truck, Undo } from 'lucide-react';

export function CartOrderSummary({ cart }: { cart: CartDTO }) {
  const t = useScopedI18n('cart.orderSummary');
  const store = useStore();

  return (
    <div className="bg-muted/60 flex flex-col gap-4 rounded-lg p-3">
      <Heading as="h2" className="!text-lg">
        {t('title')}
      </Heading>

      <Badge variant="success" className="flex items-center gap-2 py-2">
        <CheckCircle size={20} />
        <span>{t('freeShippingEligibility')}</span>
      </Badge>

      <div className="flex flex-col gap-2 text-sm">
        <p className="flex items-center justify-between">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(cart.totalAmount, store.currency)}</span>
        </p>
        <hr className="my-2" />
        <p className="flex items-center justify-between font-bold">
          <span>{t('total')}</span>
          <span>{formatPrice(cart.totalAmount, store.currency)}</span>
        </p>
      </div>

      <Button type="button" asChild>
        <NextLink href={link.checkout} className="hover:no-underline">
          {t('actions.checkout')}
        </NextLink>
      </Button>
      <div className="flex flex-col gap-2 text-xs">
        <p className="text-muted-foreground flex items-center gap-2">
          <Truck size={15} />
          {t('cartInfo.freeShipping', {
            price: formatPrice(store.freeShippingThreshold, store.currency),
          })}
        </p>
        <p className="text-muted-foreground flex items-center gap-2">
          <Undo size={15} />
          {t('cartInfo.freeReturns')}
        </p>
        <p className="text-muted-foreground flex items-center gap-2">
          <Lock size={15} />
          {t('cartInfo.securePayment')}
        </p>
      </div>
    </div>
  );
}
