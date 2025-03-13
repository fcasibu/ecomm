import type { ProductVariantDTO } from "../products/product-dto";

export interface CategoryDTO {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  id: string;
  createdAt: string;
  updatedAt: string;
  products: {
    name: string;
    sku: string;
    id: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    features: string[];
    categoryId: string | null;
    variants: ProductVariantDTO[];
  }[];
  children: {
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    parentId: string | null;
    id: string;
    createdAt: string;
    updatedAt: string;
  }[];
}
