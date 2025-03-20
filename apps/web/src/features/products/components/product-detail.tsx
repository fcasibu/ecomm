import type { ProductDTO } from '@ecomm/services/products/product-dto';
import { ProductDetailProvider } from './product-detail-provider';
import { ProductImage } from './product-image';

export function ProductDetail({
  product,
  selectedSku,
}: {
  product: ProductDTO;
  selectedSku: string;
}) {
  return (
    <ProductDetailProvider selectedSku={selectedSku} product={product}>
      <div className="container flex h-full flex-col gap-4 py-12 lg:flex-row lg:gap-6">
        <div className="relative flex-1">
          <div className="sticky top-[100px]">
            <ProductImage />
          </div>
        </div>
        <div className="flex-1">
          <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
          <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
          <div className="h-[500px] w-full bg-red-500">Hello, WOrld!</div>
        </div>
      </div>
    </ProductDetailProvider>
  );
}
