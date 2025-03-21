'use client';

import { useScopedI18n } from "@/locales/client";
import { Button } from "@ecomm/ui/button";
import { Heart } from "lucide-react";

export function ProductWishListButton() {
  const t = useScopedI18n('productDetail.wishlist')

  return (
    <Button type="button" className="w-full flex gap-2 items-center" variant="outline">
      <Heart />
      <span>{t('title')}</span>
    </Button>
  )
}
