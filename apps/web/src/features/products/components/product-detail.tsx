import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { ProductDetailProvider } from '../providers/product-detail-provider';
import { ProductImage } from './product-image';
import { Heading } from '@ecomm/ui/typography';
import { formatPrice } from '@ecomm/lib/format-price';
import { ProductVariantProvider } from '../providers/product-variant-provider';
import { ProductVariantSelection } from './product-variant-selection';
import { ProductSizeSelection } from './product-size-selection';
import { ProductQuantity } from './product-quantity';

export function ProductDetail({
  product,
  selectedSku,
}: {
  product: ProductDTO;
  selectedSku: string;
}) {
  const selectedVariant =
    product.variants.find((variant) => variant.sku === selectedSku) ??
    product.variants[0]!;

  return (
    <ProductDetailProvider selectedVariant={selectedVariant} product={product}>
      <ProductVariantProvider currentVariant={selectedVariant}>
        <div className="container flex h-full flex-col gap-4 py-12 lg:flex-row lg:gap-6">
          <div className="relative flex-1">
            <div className="sticky top-[100px]">
              <ProductImage />
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <div>
              <Heading as="h1" className="!text-3xl">
                {product.name}
              </Heading>
              <p className="text-muted-foreground">{selectedSku}</p>
            </div>
            <p className="text-xl font-bold">
              {formatPrice(
                selectedVariant.price.value,
                selectedVariant.price.currency,
              )}
            </p>
            <ProductVariantSelection />
            <ProductSizeSelection />
            <ProductQuantity />
          </div>
        </div>
      </ProductVariantProvider>
    </ProductDetailProvider>
  );
}
