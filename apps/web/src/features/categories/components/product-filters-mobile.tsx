'use client';

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@ecomm/ui/sheet';
import { Button } from '@ecomm/ui/button';
import { ProductFilters } from './product-filters';
import { useScopedI18n } from '@/locales/client';
import { useWindowResize } from '@ecomm/ui/hooks/use-window-resize';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';

export function ProductFiltersMobile() {
  const { width } = useWindowResize();
  const [open, setOpen] = useState(false);
  const t = useScopedI18n('productListing.filters');

  useEffect(() => {
    if (width && width >= 1024) {
      setOpen(false);
    }
  }, [width]);

  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            type="button"
            className="flex items-center gap-2"
          >
            <Filter />
            <span>{t('title')}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="h-full overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="sr-only">{t('title')}</SheetTitle>
            <SheetClose />
          </SheetHeader>
          <ProductFilters />
        </SheetContent>
      </Sheet>
    </div>
  );
}
