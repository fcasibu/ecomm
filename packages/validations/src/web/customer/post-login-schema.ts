import { z } from 'zod';

export const postLoginSchema = z.object({
  emailAddress: z.string().email(),
  authUserId: z.string(),
});

export type PostLoginInput = z.infer<typeof postLoginSchema>;
