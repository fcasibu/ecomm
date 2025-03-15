import { z } from 'zod';

export const cartCreateSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z
    .array(
      z.object({
        sku: z.string().min(1, 'Please select a variant'),
        productId: z
          .string()
          .min(1, 'Please select a product')
          .uuid({ message: 'Please select a product' }),
        quantity: z.number().min(1, 'A minimum of 1 quantity is required'),
      }),
    )
    .nonempty('You have to add at least one item'),
});

export const cartUpdateSchema = z.object({
  items: z.array(
    z.object({
      sku: z.string(),
      id: z.string().uuid().optional(),
      productId: z.string().uuid(),
      quantity: z.number().min(1, 'A minimum of 1 quantity is required'),
    }),
  ),
});

export type CartCreateInput = z.infer<typeof cartCreateSchema>;

export type CartUpdateInput = z.infer<typeof cartUpdateSchema>;
