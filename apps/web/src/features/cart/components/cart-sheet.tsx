'use client';

import { NextLink } from '@/components/link';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import type { CartDTO, CartItemDTO } from '@ecomm/services/cart/cart-dto';
import { Button } from '@ecomm/ui/button';
import { ImageComponent } from '@ecomm/ui/image';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@ecomm/ui/sheet';
import { link } from '@/lib/utils/link-helper';
import { useStore } from '@/features/store/providers/store-provider';
import { useActionState } from 'react';
import { updateItemQuantityAction } from '@/lib/actions/cart';
import type { UpdateItemQuantityInput } from '@ecomm/validations/web/cart/update-item-quantity-schema';

function CartItem({
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
  const t = useScopedI18n('cart.sheet.item');

  return (
    <div className="flex items-start gap-4 border-b py-4 last:border-none">
      <ImageComponent
        src={item.image}
        alt={item.name}
        width={120}
        height={120}
        className="aspect-square object-cover"
        quality={20}
      />
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between">
          <p className="font-semibold">{item.name}</p>
          <Button
            variant="ghost"
            aria-label={t('actions.remove', { name: item.name })}
            type="submit"
            formAction={() => formAction({ itemId: item.id, newQuantity: 0 })}
            disabled={isPending}
          >
            <Trash2 size={16} />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="mt-2 flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              aria-label={t('actions.quantity.decrease')}
              formAction={() =>
                formAction({ itemId: item.id, newQuantity: item.quantity - 1 })
              }
              disabled={isPending}
              type="submit"
            >
              <Minus size={16} />
            </Button>
            <span className="w-8 text-center">{item.quantity}</span>
            <Button
              size="sm"
              variant="outline"
              aria-label={t('actions.quantity.increase')}
              formAction={() =>
                formAction({ itemId: item.id, newQuantity: item.quantity + 1 })
              }
              disabled={isPending}
              type="submit"
            >
              <Plus size={16} />
            </Button>
          </div>
          <div className="ml-2 mt-1 whitespace-nowrap font-bold">
            {formatPrice(item.price * item.quantity, currency)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CartSheet({ cart }: { cart: CartDTO | null }) {
  const t = useScopedI18n('cart.sheet');
  const locale = useCurrentLocale();
  const router = useRouter();
  const store = useStore();
  const [result, formAction, isPending] = useActionState(
    updateItemQuantityAction,
    cart
      ? {
          success: true,
          data: cart,
        }
      : null,
  );

  const cartData = result?.success ? result.data : cart;

  const sortedCartItems =
    cartData?.items.toSorted(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ) ?? [];

  return (
    <Sheet
      open
      onOpenChange={(state) => {
        if (!state) router.back();
      }}
    >
      <SheetContent side="right" className="flex h-full max-w-[600px] flex-col">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag />
            {t('title', { value: cartData?.items.length ?? 0 })}
          </SheetTitle>
          <SheetClose />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {sortedCartItems.length > 0 ? (
            <form>
              {sortedCartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  currency={store.currency}
                  formAction={formAction}
                  isPending={isPending}
                />
              ))}
            </form>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
              <div className="bg-muted rounded-full p-6">
                <ShoppingBag size={40} />
              </div>
              <div>
                <p className="text-lg">{t('empty.title')}</p>
                <p className="text-muted-foreground text-sm">
                  {t('empty.description')}
                </p>
              </div>
              <SheetClose asChild>
                <Button variant="outline" className="mt-4">
                  {t('actions.continueShopping')}
                </Button>
              </SheetClose>
            </div>
          )}
        </div>

        {sortedCartItems.length > 0 && (
          <footer className="border-t">
            <hr className="my-3" />
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">{t('total')}</span>
              {cartData?.totalAmount && (
                <span className="font-semibold">
                  {formatPrice(cartData.totalAmount, store.currency)}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <Button asChild>
                <NextLink
                  href={link.cart}
                  className="w-full hover:no-underline"
                  onClick={() => {
                    console.log('runining?');
                    window.location.href = `/${locale}${link.cart}`;
                  }}
                >
                  {t('actions.checkout')}
                  <ArrowRight size={16} className="ml-2" />
                </NextLink>
              </Button>
              <SheetClose asChild>
                <Button variant="outline" className="w-full">
                  {t('actions.continueShopping')}
                </Button>
              </SheetClose>
            </div>
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
}
