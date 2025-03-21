'use client';

import { useScopedI18n } from "@/locales/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ecomm/ui/tabs";
import { useProductDetail } from "../providers/product-detail-provider";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@ecomm/ui/lib/utils";

export function ProductTabs() {
  const { product } = useProductDetail();
  const t = useScopedI18n('productDetail.tabs');

  return (
    <div>
      <Tabs defaultValue="description">
        <TabsList className="bg-transparent border-b w-full flex justify-start !rounded-none border-b-muted">
          <TabTrigger
            value="description"
          >
            <span>{t('description')}</span>
          </TabTrigger>
          <TabTrigger
            value="features"
          >
            <span>{t('features')}</span>
          </TabTrigger>
        </TabsList>
        <TabsContent value="description" className="mt-6 text-muted-foreground">
          <p>{product.description}</p>
        </TabsContent>
        <TabsContent value="features" className="mt-6">
          <ul>
            {product.features.map((feature, index) => (
              <li key={`${feature}-${index}`} className="flex gap-2 items-center text-muted-foreground text-md">
                <CheckCircle2 className="fill-muted" size={18} />
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TabTrigger({ children, className, value }: React.PropsWithChildren & { value: string; className?: string }) {
  return <TabsTrigger
    className={cn("pb-4 rounded-none border-b-2 border-transparent data-[state=active]:border-b-black focus-visible:ring-0 shadow-none capitalize", className)}
    value={value}
  >
    {children}
  </TabsTrigger>
}
