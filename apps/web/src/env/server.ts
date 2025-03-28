import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const serverEnv = createEnv({
  server: {
    DATABASE_URL: z.string(),
    SANITY_TOKEN: z.string(),
    SANITY_WEBHOOK_SECRET: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    ALGOLIA_WRITE_KEY: z.string(),
    CRON_SECRET: z.string(),
    CLERK_SECRET_KEY: z.string(),
  },
  experimental__runtimeEnv: process.env,
});
