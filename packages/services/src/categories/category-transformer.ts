import { BaseTransformer } from "../base-transformer";
import type { ProductAttribute } from "../products/product-dto";
import type { Category } from "./categories-service";
import type { CategoryDTO } from "./category-dto";

export class CategoryTransformer extends BaseTransformer {
  public toDTO(category: Category | null | undefined): CategoryDTO | null {
    if (!category) return category ?? null;

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
        this.transformProduct(product),
      ),
      createdAt: this.formatDateToISO(category.createdAt),
      updatedAt: this.formatDateToISO(category.updatedAt),
    };
  }

  private transformCategoryChild(
    category: Category["children"][number],
  ): CategoryDTO["children"][number] {
    return {
      slug: category.slug,
      image: category.image,
      parentId: category.parentId,
      id: category.id,
      name: category.name,
      description: category.description,
      createdAt: this.formatDateToISO(category.createdAt),
      updatedAt: this.formatDateToISO(category.updatedAt),
    };
  }

  private transformProduct(
    product: Category["products"][number],
  ): CategoryDTO["products"][number] {
    return {
      id: product.id,
      description: product.description,
      name: product.name,
      features: product.features,
      sku: product.sku,
      variants: product.variants.map((variant) =>
        this.transformVariant(variant),
      ),
      categoryId: product.categoryId,
      createdAt: this.formatDateToISO(product.createdAt),
      updatedAt: this.formatDateToISO(product.updatedAt),
    };
  }

  private transformVariant(
    variant: Category["products"][number]["variants"][number],
  ): CategoryDTO["products"][number]["variants"][number] {
    const attributes = variant.attributes as ProductAttribute[];

    return {
      id: variant.id,
      images: variant.images,
      sku: variant.sku,
      stock: variant.stock,
      currencyCode: variant.currencyCode,
      createdAt: this.formatDateToISO(variant.createdAt),
      updatedAt: this.formatDateToISO(variant.updatedAt),
      price: variant.price.toNumber(),
      attributes: Object.fromEntries(
        attributes?.map((attribute) => [attribute.title, attribute.value]) ??
          [],
      ),
    };
  }
}
