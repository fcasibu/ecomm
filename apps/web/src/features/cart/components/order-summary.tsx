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
import { CheckCircle, Shield, Truck, Undo } from 'lucide-react';
import { getCartShippingFee } from '../utils/get-cart-shipping-fee';
import { getCartTotal } from '../utils/get-cart-total';

export function CartOrderSummary({ cart }: { cart: CartDTO }) {
  const t = useScopedI18n('cart.orderSummary');
  const store = useStore();

  const priceNeeded = Math.max(store.freeShippingThreshold - cart.subtotal, 0);
  const shippingFee = getCartShippingFee(store, cart);
  const cartTotal = getCartTotal(store, cart);

  return (
    <div className="bg-muted/60 flex flex-col gap-4 rounded-lg p-3">
      <Heading as="h2" className="!text-lg">
        {t('title')}
      </Heading>

      {priceNeeded === 0 && (
        <Badge variant="success" className="flex items-center gap-2 py-2">
          <CheckCircle size={20} />
          <span>{t('freeShippingEligibility')}</span>
        </Badge>
      )}

      <div className="flex flex-col gap-2 text-sm">
        <p className="flex items-center justify-between">
          <span>{t('subtotal')}</span>
          <span>{formatPrice(cart.subtotal, store.currency)}</span>
        </p>
        <p className="flex items-center justify-between">
          <span>{t('shipping')}</span>
          {shippingFee > 0 ? (
            <span>{formatPrice(shippingFee, store.currency)}</span>
          ) : (
            <span className="text-success-foreground font-bold">
              {t('free')}
            </span>
          )}
        </p>
        <hr className="my-2" />
        <p className="flex items-center justify-between font-bold">
          <span>{t('total')}</span>
          <span>{formatPrice(cartTotal, store.currency)}</span>
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
          <Shield size={15} />
          {t('cartInfo.securePayment')}
        </p>
      </div>
    </div>
  );
}
