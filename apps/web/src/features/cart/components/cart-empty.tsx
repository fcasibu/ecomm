'use client';

import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CartEmpty() {
  const t = useScopedI18n('cart.empty');
  const router = useRouter();

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="bg-muted text-muted-foreground rounded-full p-4">
        <ShoppingBag size={48} />
      </div>
      <div className="max-w-[500px] space-y-1 text-balance">
        <p className="text-lg font-semibold">{t('title')}</p>
        <p className="text-muted-foreground text-sm">{t('description')}</p>
      </div>
      <Button variant="outline" className="mt-4" onClick={() => router.back()}>
        {t('actions.continueShopping')}
      </Button>
    </div>
  );
}
