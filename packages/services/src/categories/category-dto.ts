import type { Prisma } from "@ecomm/db";

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
    id: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    features: string[];
    price: Prisma.Decimal;
    currencyCode: string;
    stock: number;
    sku: string;
    images: string[];
    categoryId: string;
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
