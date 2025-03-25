import type {
  DeliveryPromiseDTO,
  ProductVariantDTO,
} from '@ecomm/services/products/product-dto';

export interface AlgoliaProductHit {
  objectID: string;
  id: string;
  name: string;
  description: string | null;
  image: string | null | undefined;
  sku: string;
  categorySlug: string;
  price: AlgoliaProductPrice;
  updatedAt: string;
  attributes: ProductVariantDTO['attributes'];
  variants: AlgoliaProductVariant[];
  deliveryPromises: DeliveryPromiseDTO[];
}

export interface AlgoliaProductVariant {
  id: string;
  image: string | null | undefined;
  sku: string;
}

export interface AlgoliaProductPrice {
  value: number;
  currency: string;
}
