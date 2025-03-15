import { z } from 'zod';

export const addressSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(['BILLING', 'SHIPPING']),
  street: z.string().min(1, 'Street is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string(),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
});

export const customerCreateSchema = z
  .object({
    firstName: z.string().optional(),
    middleName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.date().optional(),
    password: z.string().optional(),
    passwordConfirm: z.string().optional(),
    email: z.string().email(),
    phone: z.string().optional(),
    addresses: z
      .array(addressSchema)
      .max(5, 'You can only have 5 maximum addresses'),
    authMode: z.boolean().optional(),
    currentStage: z
      .enum(['customer-details', 'security', 'addresses'])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const isPasswordStep = data.currentStage === 'security';

    if (isPasswordStep && !data.authMode) {
      if (
        data.password &&
        data.passwordConfirm &&
        data.password !== data.passwordConfirm
      ) {
        ctx.addIssue({
          path: ['passwordConfirm'],
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match',
        });
      }

      if (!data.password || data.password.length === 0) {
        ctx.addIssue({
          path: ['password'],
          code: z.ZodIssueCode.custom,
          message: 'Password is required',
        });
      }

      if (!data.passwordConfirm || data.passwordConfirm.length === 0) {
        ctx.addIssue({
          path: ['passwordConfirm'],
          code: z.ZodIssueCode.custom,
          message: 'Password confirmation is required',
        });
      }
    }
  });

export const customerUpdateSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.date().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  addresses: z
    .array(addressSchema)
    .max(5, 'You can only have 5 maximum addresses'),
});

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
export type AddressInput = z.infer<typeof addressSchema>;

export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
