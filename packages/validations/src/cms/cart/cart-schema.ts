import { z } from 'zod';
import { productDeliveryPromiseCreateSchema } from '../products/product-schema';

export const cartCreateSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1, 'Please select a name'),
        sku: z.string().min(1, 'Please select a variant'),
        size: z.string().min(1, 'Please select a size'),
        quantity: z.number().min(1, 'A minimum of 1 quantity is required'),
        color: z.string().min(1, 'Please select a color'),
        image: z.string().min(1, 'Please select an image'),
        price: z.number().min(1, 'Please select a price'),
        deliveryPromises: z.array(productDeliveryPromiseCreateSchema),
      }),
    )
    .nonempty('You have to add at least one item'),
});

export type CartCreateInput = z.infer<typeof cartCreateSchema>;
