import { z } from 'zod';

export const updateDeliveryPromiseSelectionSchema = z.object({
  itemId: z.string(),
  deliveryPromiseId: z.string(),
});

export type UpdateDeliveryPromiseSelectionInput = z.infer<
  typeof updateDeliveryPromiseSelectionSchema
>;
