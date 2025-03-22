import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { ProductDetailProvider } from '../providers/product-detail-provider';
import { ProductImage } from './product-image';
import { Heading } from '@ecomm/ui/typography';
import { formatPrice } from '@ecomm/lib/format-price';
import { ProductVariantProvider } from '../providers/product-variant-provider';
import { ProductVariantSelection } from './product-variant-selection';
import { ProductSizeSelection } from './product-size-selection';
import { ProductQuantity } from './product-quantity';
import { ProductAddToCart } from './product-add-to-cart';
import { ProductWishListButton } from './product-wishlist-button';
import { ProductShareButton } from './product-share-button';
import { ProductGuarantees } from './product-guarantees';
import { ProductTabs } from './product-tabs';
import { Separator } from '@ecomm/ui/separator';

export function ProductDetail({
  product,
  selectedSku,
}: {
  product: ProductDTO;
  selectedSku: string;
}) {
  const selectedVariant =
    product.variants.find(
      (variant) => variant.sku.toLowerCase() === selectedSku.toLowerCase(),
    ) ?? product.variants[0]!;

  return (
    <ProductDetailProvider selectedVariant={selectedVariant} product={product}>
      <ProductVariantProvider currentVariant={selectedVariant}>
        <div className="container flex h-full flex-col gap-4 pt-12 lg:flex-row lg:gap-6">
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
              <p className="text-muted-foreground">{selectedVariant.sku}</p>
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
            <ProductAddToCart />
            <div className="flex gap-2">
              <ProductWishListButton />
              <ProductShareButton />
            </div>
            <ProductGuarantees />
            <Separator className="my-2" />
            <ProductTabs />
          </div>
        </div>
      </ProductVariantProvider>
    </ProductDetailProvider>
  );
}
