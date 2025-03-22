'use client';

import { useScopedI18n } from '@/locales/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ecomm/ui/tabs';
import { useProductDetail } from '../providers/product-detail-provider';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@ecomm/ui/lib/utils';

export function ProductTabs() {
  const { product } = useProductDetail();
  const t = useScopedI18n('productDetail.tabs');

  return (
    <div>
      <Tabs defaultValue="description">
        <TabsList className="border-b-muted flex w-full justify-start !rounded-none border-b bg-transparent">
          <TabTrigger value="description">
            <span>{t('description')}</span>
          </TabTrigger>
          <TabTrigger value="features">
            <span>{t('features')}</span>
          </TabTrigger>
        </TabsList>
        <TabsContent value="description" className="text-muted-foreground mt-6">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="features" className="mt-6">
          <ul>
            {product.features.map((feature, index) => (
              <li
                key={`${feature}-${index}`}
                className="text-muted-foreground text-md flex items-center gap-2"
              >
                <CheckCircle2 className="fill-muted" size={18} />
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function TabTrigger({
  children,
  className,
  value,
}: React.PropsWithChildren & { value: string; className?: string }) {
  return (
    <TabsTrigger
      className={cn(
        'rounded-none border-b-2 border-transparent pb-4 capitalize shadow-none focus-visible:ring-0 data-[state=active]:border-b-black',
        className,
      )}
      value={value}
    >
      {children}
    </TabsTrigger>
  );
}
