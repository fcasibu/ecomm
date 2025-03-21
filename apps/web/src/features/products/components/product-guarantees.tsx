'use client';

import { useStore } from "@/features/store/providers/store-provider";
import { useScopedI18n } from "@/locales/client";
import { formatPrice } from "@ecomm/lib/format-price";
import { Shield, Truck, Undo } from "lucide-react";

export function ProductGuarantees() {
  const store = useStore();
  const t = useScopedI18n('productDetail.guarantees')

  return (
    <div className="flex flex-col gap-6 items-start justify-center md:flex-row lg:gap-2 mt-4">
      {!!store?.freeShippingThreshold && <Badge icon={Truck} title={t('freeShipping.title')} subtitle={t('freeShipping.subtitle', {
        value: formatPrice(store.freeShippingThreshold, store.currency)
      })} />}
      <Badge icon={Undo} title={t('easyReturns.title')} subtitle={t('easyReturns.subtitleL')} />
      <Badge icon={Shield} title={t('secureCheckout.title')} subtitle={t('secureCheckout.subtitle')} />
    </div>
  )
}

function Badge({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return <div className="flex gap-2 flex-1">
    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center aspect-square">
      <Icon size={20} />
    </div>
    <div className="w-full">
      <span className="text-sm block">{title}</span>
      <span className="text-xs text-muted-foreground block">{subtitle}</span>
    </div>
  </div>
} 
