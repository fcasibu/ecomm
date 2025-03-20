'use server';

import { executeOperation } from '@ecomm/lib/execute-operation';
import { validateAction } from '../utils/action-validator';
import {
  newsletterSubscribeSchema,
  newsletterUnsubscribeSchema,
} from '@ecomm/validations/web/newsletter/newsletter-schema';

export const subscribe = validateAction(
  newsletterSubscribeSchema,
  async (data) => {
    return await executeOperation(() => Promise.resolve({ email: data.email }));
  },
);

export const unsubscribe = validateAction(
  newsletterUnsubscribeSchema,
  async () => {
    return await executeOperation(() => Promise.resolve({ success: true }));
  },
);
