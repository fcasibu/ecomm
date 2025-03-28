'use client';

import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Heading } from '@ecomm/ui/typography';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CartHeading({ itemsCount }: { itemsCount: number }) {
  const t = useScopedI18n('cart');
  const router = useRouter();

  return (
    <div className="flex flex-col items-start gap-2">
      <Button
        variant="none"
        type="button"
        className="text-muted-foreground flex gap-2 p-0 text-sm hover:underline"
        onClick={() => router.back()}
      >
        <ChevronLeft size={15} />
        {t('actions.continueShopping')}
      </Button>
      <Heading as="h1" className="!text-xl">
        {t('title', { count: itemsCount })}
      </Heading>
    </div>
  );
}
