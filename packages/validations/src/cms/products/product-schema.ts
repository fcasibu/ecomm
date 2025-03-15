import { z } from "zod";

export const AttributeKey = {
  COLOR: "color",
  SIZE: "size",
} as const;

export const productAttributes = {
  [AttributeKey.COLOR]: {
    title: "Color",
    validation: z.string().min(1, "Color is required"),
  },
  [AttributeKey.SIZE]: {
    title: "Size",
    validation: z.string().min(1, "Size is required"),
  },
} as const;

const variantAttributeSchema = z.array(
  z
    .object({
      title: z.enum([AttributeKey.COLOR, AttributeKey.SIZE]),
      value: z.any(),
    })
    .superRefine((attr, ctx) => {
      const config = productAttributes[attr.title];
      const result = config.validation.safeParse(attr.value);

      if (!result.success) {
        result.error.issues.forEach((issue) => ctx.addIssue(issue));
      }
    }),
);

export const productCreateVariantSchema = z.object({
  price: z.number(),
  stock: z.number(),
  images: z
    .array(z.string().min(1, "Variant image is required"))
    .nonempty({ message: "Please provide an image" })
    .max(5, "You can only upload up to 5 images"),
  attributes: variantAttributeSchema,
});

export const productUpdateVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number(),
  stock: z.number(),
  images: z
    .array(z.string().min(1, "Variant image is required"))
    .nonempty({ message: "Please provide an image" })
    .max(5, "You can only upload up to 5 images"),
  attributes: variantAttributeSchema,
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
