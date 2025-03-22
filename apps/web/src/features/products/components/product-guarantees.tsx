'use client';

import { useStore } from '@/features/store/providers/store-provider';
import { useScopedI18n } from '@/locales/client';
import { formatPrice } from '@ecomm/lib/format-price';
import { Shield, Truck, Undo } from 'lucide-react';

export function ProductGuarantees() {
  const store = useStore();
  const t = useScopedI18n('productDetail.guarantees');

  return (
    <div className="mt-4 flex flex-col items-start justify-center gap-6 md:flex-row lg:gap-2">
      {!!store?.freeShippingThreshold && (
        <Badge
          icon={Truck}
          title={t('freeShipping.title')}
          subtitle={t('freeShipping.subtitle', {
            value: formatPrice(store.freeShippingThreshold, store.currency),
          })}
        />
      )}
      <Badge
        icon={Undo}
        title={t('easyReturns.title')}
        subtitle={t('easyReturns.subtitleL')}
      />
      <Badge
        icon={Shield}
        title={t('secureCheckout.title')}
        subtitle={t('secureCheckout.subtitle')}
      />
    </div>
  );
}

function Badge({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-1 gap-2">
      <div className="bg-muted flex aspect-square h-9 w-9 items-center justify-center rounded-full">
        <Icon size={20} />
      </div>
      <div className="w-full">
        <span className="block text-sm">{title}</span>
        <span className="text-muted-foreground block text-xs">{subtitle}</span>
      </div>
    </div>
  );
}
