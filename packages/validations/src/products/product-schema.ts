import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currencyCode: z.string(),
  images: z.array(z.string()),
  stock: z.number(),
  sku: z.string(),
  categoryId: z.string(),
  features: z.array(z.string()),
});

export const productUpdateSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  currencyCode: z.string(),
  images: z.array(z.string()),
  stock: z.number(),
  categoryId: z.string(),
  features: z.array(z.string()),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
