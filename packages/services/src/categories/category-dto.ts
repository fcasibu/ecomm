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
    description: string | null;
    createdAt: string;
    updatedAt: string;
    features: string[];
    categoryId: string | null;
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
