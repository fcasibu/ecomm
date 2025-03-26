import { z } from 'zod';

export const updateItemQuantitySchema = z.object({
  itemId: z.string(),
  newQuantity: z.number(),
});

export type UpdateItemQuantityInput = z.infer<typeof updateItemQuantitySchema>;
