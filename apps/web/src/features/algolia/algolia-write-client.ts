import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import { lazy } from '@ecomm/lib/lazy';
import { algoliasearch } from 'algoliasearch';

export const algoliaWriteClient = lazy(() =>
  algoliasearch(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    serverEnv.ALGOLIA_WRITE_KEY,
  ),
);
