import { BaseTransformer } from '../base-transformer';
import type {
  DeliveryPromiseDTO,
  ProductAttribute,
  ProductDTO,
  ProductVariantDTO,
} from './product-dto';
import type { Product } from './products-service';

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
        this.transformVariant(variant),
      ),
      deliveryPromises: product.deliveryPromises.map((deliveryPromise) =>
        this.transformDeliveryPromise(deliveryPromise),
      ),
      category: this.transformCategory(product.category),
    };
  }

  private transformVariant(
    variant: Product['variants'][number],
  ): ProductVariantDTO {
    const attributes = variant.attributes as ProductAttribute[];

    return {
      id: variant.id,
      images: variant.images,
      sku: variant.sku,
      stock: variant.stock,
      createdAt: this.formatDateToISO(variant.createdAt),
      updatedAt: this.formatDateToISO(variant.updatedAt),
      price: variant.price.toNumber(),
      attributes: Object.fromEntries(
        attributes?.map((attribute) => [attribute.title, attribute.value]) ??
          [],
      ),
    };
  }

  private transformDeliveryPromise(
    deliveryPromise: Product['deliveryPromises'][number],
  ): DeliveryPromiseDTO {
    return {
      id: deliveryPromise.id,
      price: deliveryPromise.price.toNumber(),
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
