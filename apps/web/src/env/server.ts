import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SENTRY_AUTH_TOKEN: z.string(),
    SANITY_TOKEN: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
