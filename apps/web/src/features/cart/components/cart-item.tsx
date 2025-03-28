'use client';

import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import type { CartItemDTO } from '@ecomm/services/cart/cart-dto';
import { Button } from '@ecomm/ui/button';
import { ImageComponent } from '@ecomm/ui/image';
import type { UpdateItemQuantityInput } from '@ecomm/validations/web/cart/update-item-quantity-schema';
import { Trash2, Minus, Plus } from 'lucide-react';

export function CartItem({
  item,
  currency,
  formAction,
  isPending,
}: {
  item: CartItemDTO;
  currency: string;
  formAction: (payload: UpdateItemQuantityInput) => void;
  isPending: boolean;
}) {
  const t = useScopedI18n('cart.item');

  return (
    <div className="flex items-start gap-4">
      <ImageComponent
        src={item.image}
        alt={item.name}
        width={100}
        height={100}
        className="aspect-square rounded-md object-cover"
        quality={25}
      />
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <div className="flex items-start justify-between gap-2">
            <NextLink
              href={link.product.single(item.name, item.sku)}
              className="line-clamp-2 flex-1 text-sm font-semibold sm:text-base"
            >
              {item.name}
            </NextLink>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0 bg-transparent"
              aria-label={t('actions.remove', { name: item.name })}
              type="submit"
              formAction={() => formAction({ itemId: item.id, newQuantity: 0 })}
              disabled={isPending}
            >
              <Trash2 size={16} />
            </Button>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs">{item.color}</span>
            <span className="text-muted-foreground text-xs">
              {t('size', { value: item.size })}
            </span>
          </div>
        </div>

        <div className="flex h-full items-end justify-between">
          <div className="flex w-full items-center">
            <Button
              size="icon"
              variant="none"
              className="h-8 w-8 rounded-none border"
              aria-label={t('actions.quantity.decrease')}
              formAction={() =>
                formAction({ itemId: item.id, newQuantity: item.quantity - 1 })
              }
              disabled={isPending || item.quantity <= 1}
              type="submit"
            >
              <Minus size={14} />
            </Button>
            <span className="border-input flex h-8 w-full max-w-[70px] items-center justify-center border text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              size="icon"
              variant="none"
              className="h-8 w-8 rounded-none border"
              aria-label={t('actions.quantity.increase')}
              formAction={() =>
                formAction({ itemId: item.id, newQuantity: item.quantity + 1 })
              }
              disabled={isPending}
              type="submit"
            >
              <Plus size={14} />
            </Button>
          </div>

          <div className="whitespace-nowrap text-sm font-bold sm:text-base">
            {formatPrice(item.price * item.quantity, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}
