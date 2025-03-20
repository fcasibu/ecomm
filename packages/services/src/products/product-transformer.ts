import assert from 'node:assert';
import { BaseTransformer } from '../base-transformer';
import type {
  DeliveryPromiseDTO,
  ProductAttribute,
  ProductDTO,
  ProductVariantDTO,
  StockStatus,
} from './product-dto';
import type { Product } from './products-service';
import { isDefined } from '@ecomm/lib/is-defined';

export class ProductTransformer extends BaseTransformer {
  public toDTO(product: Product | null | undefined): ProductDTO | null {
    if (!product) return null;

    return {
      id: product.id,
      sku: product.sku,
      name: product.name,
      features: product.features,
      description: product.description,
      createdAt: this.formatDateToISO(product.createdAt),
      updatedAt: this.formatDateToISO(product.updatedAt),
      variants: product.variants.map((variant) =>
        this.transformVariant(variant, product.store.currency),
      ),
      deliveryPromises: product.deliveryPromises.map((deliveryPromise) =>
        this.transformDeliveryPromise(deliveryPromise, product.store.currency),
      ),
      category: this.transformCategory(product.category),
    };
  }

  private transformVariant(
    variant: Product['variants'][number],
    currency: string,
  ): ProductVariantDTO {
    const attributes = variant.attributes as ProductAttribute[];

    assert(
      Array.isArray(variant.sizes),
      'variant.sizes should always be an array',
    );

    return {
      id: variant.id,
      images: variant.images,
      sku: variant.sku,
      createdAt: this.formatDateToISO(variant.createdAt),
      updatedAt: this.formatDateToISO(variant.updatedAt),
      sizes: variant.sizes
        .map((_size) => {
          const size = _size as {
            value: string;
            stock: number;
            reserved: number;
          };

          if (!size) return null;

          return {
            value: size.value,
            stock: size.stock,
            reserved: size.reserved,
            stockStatus: getStockStatus(size.stock - size.reserved),
          };
        })
        .filter(isDefined),
      price: {
        value: variant.price.toNumber(),
        currency,
      },
      attributes: Object.fromEntries(
        attributes?.map((attribute) => [attribute.title, attribute.value]) ??
          [],
      ),
    };
  }

  private transformDeliveryPromise(
    deliveryPromise: Product['deliveryPromises'][number],
    currency: string,
  ): DeliveryPromiseDTO {
    return {
      id: deliveryPromise.id,
      price: {
        value: deliveryPromise.price.toNumber(),
        currency,
      },
      shippingMethod: deliveryPromise.shippingMethod,
      estimatedMinDays: deliveryPromise.estimatedMinDays,
      estimatedMaxDays: deliveryPromise.estimatedMaxDays,
      requiresShippingFee: deliveryPromise.requiresShippingFee,
      createdAt: this.formatDateToISO(deliveryPromise.createdAt),
      updatedAt: this.formatDateToISO(deliveryPromise.updatedAt),
    };
  }

  private transformCategory(
    category: Product['category'] | null,
  ): ProductDTO['category'] {
    if (!category) return category;

    return {
      description: category.description,
      name: category.name,
      id: category.id,
      slug: category.slug,
      tier: category.tier,
      image: category.image,
      parentId: category.parentId,
      createdAt: this.formatDateToISO(category.createdAt),
      updatedAt: this.formatDateToISO(category.updatedAt),
    };
  }
}

function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return 'OUT_OF_STOCK';

  if (stock === 1) return 'ONE_STOCK';

  if (stock <= 5) return 'LOW_STOCK';

  return 'IN_STOCK';
}
