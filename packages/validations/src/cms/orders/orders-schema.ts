import { z } from 'zod';
import { cartCreateSchema } from '../cart/cart-schema';

const cartItemSchema = z.object({
  id: z.string().uuid(),
  sku: z.string(),
  image: z.string(),
  name: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string(),
});

export const orderCreateSchema = z.object({
  customerId: z.string().uuid({ message: 'You must select a customer' }),
  shippingAddressId: z.string().uuid(),
  billingAddressId: z.string().uuid(),
  preCart: z
    .object({
      itemsForDisplay: z.array(cartItemSchema.omit({ id: true })),
    })
    .merge(cartCreateSchema),
  cart: z.object({
    id: z.string(),
    totalAmount: z.number(),
    status: z.enum(['COMPLETED', 'ACTIVE', 'ABANDONED']),
    items: z.array(cartItemSchema),
  }),
});

export const orderUpdateSchema = z.object({
  orderStatus: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
});

export type OrderCreateInput = z.infer<typeof orderCreateSchema>;

export type OrderUpdateInput = z.infer<typeof orderUpdateSchema>;
