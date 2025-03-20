export interface ProductAttribute {
  value?: string;
  title?: string;
}

export interface DeliveryPromiseDTO {
  id: string;
  shippingMethod: 'STANDARD' | 'EXPRESS' | 'NEXT_DAY';
  estimatedMinDays: number;
  estimatedMaxDays: number;
  price: {
    value: number;
    currency: string;
  };
  requiresShippingFee: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariantDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
  images: string[];
  sku: string;
  price: {
    value: number;
    currency: string;
  };
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
  deliveryPromises: DeliveryPromiseDTO[];
}
