import 'server-only';

import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';

export const client = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  token: serverEnv.SANITY_TOKEN,
});
