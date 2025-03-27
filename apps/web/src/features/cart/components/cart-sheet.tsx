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
  SheetFooter,
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
    <div className="flex items-start gap-4 border-b px-6 py-4 last:border-none">
      <ImageComponent
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="aspect-square rounded-md object-cover"
        quality={50}
      />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 flex-1 text-sm font-semibold sm:text-base">
            {item.name}
          </p>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive h-8 w-8 shrink-0"
            aria-label={t('actions.remove', { name: item.name })}
            type="submit"
            formAction={() => formAction({ itemId: item.id, newQuantity: 0 })}
            disabled={isPending}
          >
            <Trash2 size={16} />
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
              aria-label={t('actions.quantity.decrease')}
              formAction={() =>
                formAction({ itemId: item.id, newQuantity: item.quantity - 1 })
              }
              disabled={isPending || item.quantity <= 1}
              type="submit"
            >
              <Minus size={14} />
            </Button>
            <span
              className="w-8 text-center text-sm font-medium"
              aria-live="polite"
              aria-atomic="true"
            >
              {item.quantity}
            </span>
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8"
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

export function CartSheet({ cart }: { cart: CartDTO | null }) {
  const t = useScopedI18n('cart.sheet');
  const locale = useCurrentLocale();
  const router = useRouter();
  const store = useStore();
  const [result, formAction, isPending] = useActionState(
    updateItemQuantityAction,
    cart ? { success: true, data: cart } : null,
  );

  const cartData = result?.success ? result.data : cart;
  const itemCount = cartData?.items.length ?? 0;

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
      <SheetContent
        side="right"
        className="flex h-full w-full flex-col p-0 sm:max-w-lg"
      >
        <SheetHeader className="border-b px-6 py-4">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <ShoppingBag size={20} />
            {t('title', { value: itemCount })}
          </SheetTitle>
          <SheetClose />
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {itemCount > 0 ? (
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
            <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
              <div className="bg-muted text-muted-foreground rounded-full p-4">
                <ShoppingBag size={48} />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">{t('empty.title')}</p>
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

        {itemCount > 0 && (
          <SheetFooter className="bg-background mt-auto flex-col gap-3 border-t px-6 py-4 sm:flex-col sm:items-stretch">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">
                Calculated at checkout
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold">{t('total')}</span>
              {cartData?.totalAmount && (
                <span className="text-lg font-bold">
                  {formatPrice(cartData.totalAmount, store.currency)}
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button asChild size="lg">
                <NextLink
                  href={link.cart}
                  className="w-full hover:no-underline"
                  onClick={() => {
                    // force navigate to cart page instead of intercepting the route
                    window.location.href = `/${locale}${link.cart}`;
                  }}
                >
                  {t('actions.checkout')}
                  <ArrowRight size={18} className="ml-2" />
                </NextLink>
              </Button>
              <SheetClose asChild>
                <Button variant="outline" size="lg" className="w-full">
                  {t('actions.continueShopping')}
                </Button>
              </SheetClose>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
