import { z } from "zod";

export const storeCreateSchema = z.object({
  currency: z.string(),
  locale: z.string(),
});

export type StoreCreateInput = z.infer<typeof storeCreateSchema>;
