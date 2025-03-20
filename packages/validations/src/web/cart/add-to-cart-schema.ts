import { z } from 'zod';

export const addToCartSchema = z.object({
  sku: z.string(),
  size: z.string().min(1, 'errors.size'),
  quantity: z.number(),
  productId: z.string(),
});

export type AddToCartInput = z.infer<typeof addToCartSchema>;
