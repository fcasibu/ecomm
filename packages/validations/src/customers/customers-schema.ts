import { z } from "zod";

export const addressCreateSchema = z.object({
  type: z.enum(["BILLING", "SHIPPING"]),
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
  country: z.string(),
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
    addresses: z.array(addressCreateSchema).optional(),
    authMode: z.boolean().optional(),
    currentStage: z
      .enum(["customer-details", "security", "addresses"])
      .optional(),
  })
  .superRefine((data, ctx) => {
    const isPasswordStep = data.currentStage === "security";

    if (isPasswordStep && !data.authMode) {
      if (
        data.password &&
        data.passwordConfirm &&
        data.password !== data.passwordConfirm
      ) {
        ctx.addIssue({
          path: ["passwordConfirm"],
          code: z.ZodIssueCode.custom,
          message: "Passwords do not match",
        });
      }

      if (!data.password || data.password.length === 0) {
        ctx.addIssue({
          path: ["password"],
          code: z.ZodIssueCode.custom,
          message: "Password is required",
        });
      }

      if (!data.passwordConfirm || data.passwordConfirm.length === 0) {
        ctx.addIssue({
          path: ["passwordConfirm"],
          code: z.ZodIssueCode.custom,
          message: "Password confirmation is required",
        });
      }
    }
  });

export const customerUpdateSchema = z.object({
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  birthDate: z.string().date().optional(),
  password: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  addresses: z.array(addressCreateSchema).optional(),
});

export type CustomerCreateInput = z.infer<typeof customerCreateSchema>;
export type AddressCreateInput = z.infer<typeof addressCreateSchema>;

export type CustomerUpdateInput = z.infer<typeof customerUpdateSchema>;
