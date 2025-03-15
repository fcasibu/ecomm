export interface ProductAttribute {
  value?: string;
  title?: string;
}

export interface ProductVariantDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  sku: string;
  price: number;
  stock: number;
  attributes: {
    size: string;
    color: string;
  };
}

export interface ProductDTO {
  name: string;
  sku: string;
  description: string | null;
  features: string[];
  id: string;
  createdAt: string;
  updatedAt: string;
  category: {
    name: string;
    id: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    slug: string;
    image: string | null;
    parentId: string | null;
    tier: number | null;
  } | null;
  variants: ProductVariantDTO[];
}
