'use server';

import { validateAction } from '../utils/action-validator';
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
} from '@ecomm/validations/web/newsletter/newsletter-schema';

export const subscribe = validateAction(newsletterSubscribeSchema, async () => {
  return new Promise<{ email: string }>((resolve) => {
    setTimeout(() => resolve({ email: 'asd@asd.com' }), 2000);
  });
});

export const unsubscribe = validateAction(
  newsletterUnsubscribeSchema,
  async () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => resolve(true), 2000);
    });
  },
);
