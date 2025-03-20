import assert from 'node:assert';
import { BaseTransformer } from '../base-transformer';
import type { ProductAttribute } from '../products/product-dto';
import type { Category } from './categories-service';
import type { CategoryDTO } from './category-dto';
import { isDefined } from '@ecomm/lib/is-defined';
import { getStockStatus } from '../products/product-transformer';

export class CategoryTransformer extends BaseTransformer {
  public toDTO(category: Category | null | undefined): CategoryDTO | null {
    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      parentId: category.parentId,
      image: category.image,
      slug: category.slug,
      children: category.children.map((child) =>
        this.transformCategoryChild(child),
      ),
      products: category.products.map((product) =>
        this.transformProduct(product, category.store.currency),
      ),
      createdAt: this.formatDateToISO(category.createdAt),
      updatedAt: this.formatDateToISO(category.updatedAt),
    };
  }

  private transformCategoryChild(
    category: Category['children'][number] & {
      children?: Category['children'];
    },
  ): CategoryDTO['children'][number] {
    return {
      slug: category.slug,
      image: category.image,
      parentId: category.parentId,
      id: category.id,
      name: category.name,
      description: category.description,
      children:
        category.children
          ?.map((child) => (child ? this.transformCategoryChild(child) : null))
          .filter((child): child is CategoryDTO['children'][number] =>
            Boolean(child),
          ) ?? [],
      createdAt: this.formatDateToISO(category.createdAt),
      updatedAt: this.formatDateToISO(category.updatedAt),
    };
  }

  private transformProduct(
    product: Category['products'][number],
    currency: string,
  ): CategoryDTO['products'][number] {
    return {
      id: product.id,
      description: product.description,
      name: product.name,
      features: product.features,
      sku: product.sku,
      variants: product.variants.map((variant) =>
        this.transformVariant(variant, currency),
      ),
      categoryId: product.categoryId,
      createdAt: this.formatDateToISO(product.createdAt),
      updatedAt: this.formatDateToISO(product.updatedAt),
    };
  }

  private transformVariant(
    variant: Category['products'][number]['variants'][number],
    currency: string,
  ): CategoryDTO['products'][number]['variants'][number] {
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
            stockStatus: getStockStatus(size.stock, size.reserved),
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
}
