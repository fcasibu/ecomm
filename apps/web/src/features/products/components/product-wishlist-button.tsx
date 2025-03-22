'use client';

import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Heart } from 'lucide-react';

export function ProductWishListButton() {
  const t = useScopedI18n('productDetail.wishlist');

  return (
    <Button
      type="button"
      className="flex w-full items-center gap-2"
      variant="outline"
    >
      <Heart />
      <span>{t('title')}</span>
    </Button>
  );
}
