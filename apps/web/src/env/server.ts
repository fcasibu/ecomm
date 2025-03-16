import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SENTRY_AUTH_TOKEN: z.string(),
    SANITY_PROJECT_ID: z.string(),
    SANITY_DATASET: z.string(),
    SANITY_API_VERSION: z.string(),
    SANITY_TOKEN: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
