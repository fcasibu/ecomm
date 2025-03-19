import { z } from 'zod';

export const newsletterSubscribeSchema = z.object({
  email: z.string().email(),
});

export const newsletterUnsubscribeSchema = z.object({
  email: z.string().email(),
});

export type NewsletterSubscribeInput = z.infer<
  typeof newsletterSubscribeSchema
>;

export type NewsletterUnsubscribeInput = z.infer<
  typeof newsletterUnsubscribeSchema
>;
