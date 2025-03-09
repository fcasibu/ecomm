import { z } from "zod";

export const productCreateVariantSchema = z.object({
  price: z.number(),
  currencyCode: z.string().min(1, "Currency code is required"),
  stock: z.number(),
  image: z.string().min(1, "Variant image is required"),
  attributes: z
    .object({
      title: z.string(),
      value: z.string(),
    })
    .optional(),
});

export const productUpdateVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number(),
  currencyCode: z.string().min(1, "Currency code is required"),
  stock: z.number(),
  image: z.string().min(1, "Variant image is required"),
  attributes: z
    .object({
      title: z.string(),
      value: z.string(),
    })
    .optional(),
});

export const productCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  features: z.array(z.string()),
  variants: z
    .array(productCreateVariantSchema)
    .min(1, "A product must have a variant"),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  features: z.array(z.string()),
  variants: z
    .array(productUpdateVariantSchema)
    .min(1, "A product must have a variant"),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductVariantCreateInput = z.infer<
  typeof productCreateVariantSchema
>;

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductVariantUpdateInput = z.infer<
  typeof productUpdateVariantSchema
>;
