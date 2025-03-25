import { z } from 'zod';

export const AttributeKey = {
  COLOR: 'color',
  WIDTH: 'width',
} as const;

export const productAttributes = {
  [AttributeKey.COLOR]: {
    title: 'Color',
    validation: z.string().min(1, 'Color is required'),
  },
  [AttributeKey.WIDTH]: {
    title: 'Width',
    validation: z.string(),
  },
} as const;

const variantAttributeSchema = z.array(
  z
    .object({
      title: z.enum([AttributeKey.COLOR, AttributeKey.WIDTH]),
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
  images: z
    .array(z.string().min(1, 'Variant image is required'))
    .nonempty({ message: 'Please provide an image' })
    .max(5, 'You can only upload up to 5 images'),
  sizes: z
    .array(
      z.object({
        value: z.string(),
        stock: z.number(),
      }),
    )
    .refine(
      (sizes) => {
        const uniqueSizes = new Set<string>(sizes.map((size) => size.value));

        return uniqueSizes.size === sizes.length;
      },
      { message: 'All items must be unique, no duplicate size allowed.' },
    ),
  attributes: variantAttributeSchema,
});

export const productUpdateVariantSchema = z.object({
  sku: z.string().optional(),
  price: z.number(),
  sizes: z.array(
    z.object({
      value: z.string(),
      stock: z.number(),
    }),
  ),
  images: z
    .array(z.string().min(1, 'Variant image is required'))
    .nonempty({ message: 'Please provide an image' })
    .max(5, 'You can only upload up to 5 images'),
  attributes: variantAttributeSchema,
});

export const productDeliveryPromiseCreateSchema = z
  .object({
    shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'NEXT_DAY']),
    price: z.number(),
    estimatedMinDays: z.number(),
    estimatedMaxDays: z.number(),
    requiresShippingFee: z.boolean().optional(),
    enabled: z.boolean(),
  })
  .superRefine((deliveryPromise, ctx) => {
    if (!deliveryPromise.enabled) {
      return;
    }

    if (deliveryPromise.shippingMethod === 'NEXT_DAY') {
      return;
    }

    if (deliveryPromise.estimatedMinDays >= deliveryPromise.estimatedMaxDays) {
      ctx.addIssue({
        code: 'custom',
        message:
          'Delivery promise estimated min days must be less than the estimated max days',
        path: ['estimatedMinDays'],
      });
    }
  });

export const productDeliveryPromiseUpdateSchema = z
  .object({
    id: z.string().uuid().optional(),
  })
  .and(productDeliveryPromiseCreateSchema);

export const productCreateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  features: z.array(z.string()),
  variants: z
    .array(productCreateVariantSchema)
    .min(1, 'A product must have a variant'),
  deliveryPromises: z.array(productDeliveryPromiseCreateSchema),
});

export const productUpdateSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  features: z.array(z.string()),
  variants: z
    .array(productUpdateVariantSchema)
    .min(1, 'A product must have a variant'),
  deliveryPromises: z.array(productDeliveryPromiseUpdateSchema),
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductVariantCreateInput = z.infer<
  typeof productCreateVariantSchema
>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
export type ProductVariantUpdateInput = z.infer<
  typeof productUpdateVariantSchema
>;

export type ProductDeliveryPromiseCreateInput = z.infer<
  typeof productDeliveryPromiseCreateSchema
>;

export type ProductDeliveryPromiseUpdateInput = z.infer<
  typeof productDeliveryPromiseUpdateSchema
>;
