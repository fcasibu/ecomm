export interface ProductVariant {
  id: string;
  createdAt: string;
  updatedAt: string;
  image: string;
  sku: string;
  price: number;
  currencyCode: string;
  stock: number;
  attributes: { value?: string; title?: string } | undefined;
}

export interface ProductDTO {
  name: string;
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
  variants: ProductVariant[];
}
