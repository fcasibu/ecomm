'use client';

import { addToCartAction } from '@/lib/actions/cart';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Loader2, ShoppingCart } from 'lucide-react';
import { useActionState, useEffect } from 'react';
import { useProductDetail } from '../providers/product-detail-provider';
import { useProductStore } from '../stores/product-store';
import { cn } from '@ecomm/ui/lib/utils';
import { useRouter } from 'next/navigation';
import { link } from '@/lib/utils/link-helper';

export function ProductAddToCart() {
  const locale = useCurrentLocale();
  const { selectedVariant, product } = useProductDetail();
  const { selectedSize, selectedQuantity } = useProductStore();
  const [result, formAction, isPending] = useActionState(addToCartAction, null);
  const t = useScopedI18n('productDetail');
  const router = useRouter();

  const getErrorMessage = () => {
    const error = result && !result.success ? result.error : null;

    if (!error) return null;

    if ('message' in error && 'code' in error) return null;

    const firstError = Object.values(error).flat()?.[0];
    if (!firstError?._errors?.[0]) return null;

    return t(firstError._errors[0] as keyof typeof t);
  };

  useEffect(() => {
    if (!result) return;

    if (result.success && result.data) {
      router.push(`/${locale}${link.cart}`);
    }
  }, [result, locale, router]);

  return (
    <div className="w-full">
      <p className="text-destructive mb-2 text-[0.8rem] font-medium">
        {getErrorMessage()}
      </p>
      <form>
        <Button
          disabled={isPending}
          type="submit"
          className={cn(
            'relative w-full overflow-hidden rounded-xl py-6 text-base font-semibold transition-all',
            isPending && 'pointer-events-none',
          )}
          size="lg"
          formAction={() =>
            formAction({
              sku: selectedVariant.sku,
              size: selectedSize,
              quantity: selectedQuantity,
              productId: product.id,
            })
          }
        >
          <span
            className={cn(
              'flex items-center justify-center gap-2 transition-opacity',
              isPending && 'opacity-0',
            )}
          >
            <ShoppingCart aria-hidden />
            {t('addToCart.title')}
          </span>
          <span
            className={cn(
              'absolute inset-0 flex items-center justify-center gap-2 transition-opacity',
              isPending ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
            {t('addToCart.loading')}
          </span>
        </Button>
      </form>
    </div>
  );
}
