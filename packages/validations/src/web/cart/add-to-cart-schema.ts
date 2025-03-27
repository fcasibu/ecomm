import { z } from 'zod';

export const addToCartSchema = z.object({
  name: z.string(),
  sku: z.string(),
  size: z.string().min(1, 'errors.size'),
  quantity: z.number(),
  color: z.string(),
  image: z.string(),
  price: z.number(),
  deliveryPromises: z.array(
    z.object({
      shippingMethod: z.enum(['STANDARD', 'EXPRESS', 'NEXT_DAY']),
      price: z.number(),
      estimatedMinDays: z.number(),
      estimatedMaxDays: z.number(),
      requiresShippingFee: z.boolean().optional(),
      selected: z.boolean(),
    }),
  ),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
