'use client';

import { Button } from '@ecomm/ui/button';
import { SearchBar } from './search-bar';
import { Heart, ShoppingCart } from 'lucide-react';
import { link } from '@/lib/utils/link-helper';
import { useScopedI18n } from '@/locales/client';

export function ActionComponents() {
  const t = useScopedI18n('header.navigation');

  return (
    <>
      <SearchBar />
      <Button
        aria-label={t('actions.wishlist.open')}
        variant="none"
        size="icon"
        className="h-min w-min"
      >
        <Heart aria-hidden />
      </Button>
      <Button
        aria-label={t('actions.cart.open')}
        variant="none"
        size="icon"
        className="h-min w-min"
        asChild
      >
        <a href={link.cart}>
          <ShoppingCart aria-hidden />
        </a>
      </Button>
    </>
  );
}
