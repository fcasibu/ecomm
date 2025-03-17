import { z } from 'zod';

export const storeCreateSchema = z.object({
  currency: z.string(),
  locale: z.string(),
});

export const storeUpdateSchema = z.object({
  freeShippingThreshold: z
    .number({ message: 'Please provide a valid shipping threshold' })
    .min(1, 'Please provide a shipping threshold greater than 0'),
});

export type StoreCreateInput = z.infer<typeof storeCreateSchema>;

export type StoreUpdateInput = z.infer<typeof storeUpdateSchema>;
