'use client';

import { Input } from '@ecomm/ui/input';
import { useScopedI18n } from '@/locales/client';
import { useProductStore } from '../stores/product-store';
import { useShallow } from 'zustand/shallow';
import { Button } from '@ecomm/ui/button';
import { Minus, Plus } from 'lucide-react';
import { Heading } from '@ecomm/ui/typography';

export function ProductQuantity() {
  const t = useScopedI18n('productDetail.quantitySelection');
  const { dispatch, selectedQuantity } = useProductStore(
    useShallow((s) => ({
      dispatch: s.dispatch,
      selectedQuantity: s.selectedQuantity,
    })),
  );

  const handleSelectQuantity = (value: number) => {
    dispatch({
      type: 'SELECT_QUANTITY',
      payload: isNaN(value) ? 1 : value,
    });
  };

  return (
    <div className="max-w-[180px] space-y-2">
      <Heading as="h2" className="!text-sm">
        {t('title')}
      </Heading>
      <div className="flex">
        <Button
          aria-label={t('action.decrease')}
          type="button"
          variant="none"
          className="rounded-none border"
          onClick={() => handleSelectQuantity(selectedQuantity - 1)}
          size="icon"
        >
          <Minus />
        </Button>
        <Input
          aria-label={t('title')}
          type="text"
          value={selectedQuantity}
          className="max-w-[70px] rounded-none border-x-transparent text-center focus-visible:ring-transparent"
          onChange={(e) => handleSelectQuantity(Number(e.target.value))}
        />
        <Button
          aria-label={t('action.increase')}
          type="button"
          variant="none"
          className="rounded-none border"
          onClick={() => handleSelectQuantity(selectedQuantity + 1)}
          size="icon"
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
}
