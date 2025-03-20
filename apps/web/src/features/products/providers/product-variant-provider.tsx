'use client';

import type { ProductVariantDTO } from '@ecomm/services/products/product-dto';
import { createContext, useContext } from 'react';

interface ProductVariantContextType {
  allSizes: { value: string; isDisabled: boolean }[];
}

const ProductVariantContext = createContext<ProductVariantContextType | null>(
  null,
);

export function useProductVariant() {
  const ctx = useContext(ProductVariantContext);

  if (!ctx) {
    throw new Error(
      'useProductVariant must be called within a ProductVariantProvider',
    );
  }

  return ctx;
}

export function ProductVariantProvider({
  children,
  currentVariant,
}: {
  children: React.ReactNode;
  currentVariant: ProductVariantDTO;
}) {
  return (
    <ProductVariantContext.Provider
      value={{
        allSizes: currentVariant.sizes
          .map((size) => ({
            value: size.value,
            isDisabled: size.stockStatus === 'OUT_OF_STOCK',
          }))
          .sort((a, b) => {
            const parsedNumA = Number(a.value);
            const parsedNumB = Number(b.value);

            if (!isNaN(parsedNumA) && !isNaN(parsedNumB))
              return parsedNumA - parsedNumB;

            return a.value.localeCompare(b.value);
          }),
      }}
    >
      {children}
    </ProductVariantContext.Provider>
  );
}
