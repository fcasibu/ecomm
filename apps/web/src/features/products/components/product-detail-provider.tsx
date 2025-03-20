'use client';

import type {
  ProductDTO,
  ProductVariantDTO,
} from '@ecomm/services/products/product-dto';
import { createContext, useContext, useMemo } from 'react';

interface ProductDetailContextType {
  product: ProductDTO;
  selectedVariant: ProductVariantDTO;
}

const ProductDetailContext = createContext<ProductDetailContextType | null>(
  null,
);

export function useProductDetail() {
  const ctx = useContext(ProductDetailContext);

  if (!ctx) {
    throw new Error(
      'useProductDetail must be called within a ProductDetailProvider',
    );
  }

  return ctx;
}

export function ProductDetailProvider({
  children,
  selectedSku,
  product,
}: {
  children: React.ReactNode;
  selectedSku: string;
  product: ProductDTO;
}) {
  const selectedVariant =
    product.variants.find((variant) => variant.sku === selectedSku) ??
    product.variants[0]!;

  const value = useMemo(
    () => ({ product, selectedVariant }),
    [product, selectedVariant],
  );

  return (
    <ProductDetailContext.Provider value={value}>
      {children}
    </ProductDetailContext.Provider>
  );
}
