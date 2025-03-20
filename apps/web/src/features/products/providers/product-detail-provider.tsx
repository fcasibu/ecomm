'use client';

import type {
  ProductDTO,
  ProductVariantDTO,
} from '@ecomm/services/products/product-dto';
import { createContext, useContext } from 'react';

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
  selectedVariant,
  product,
}: {
  children: React.ReactNode;
  selectedVariant: ProductVariantDTO;
  product: ProductDTO;
}) {
  return (
    <ProductDetailContext.Provider value={{ product, selectedVariant }}>
      {children}
    </ProductDetailContext.Provider>
  );
}
