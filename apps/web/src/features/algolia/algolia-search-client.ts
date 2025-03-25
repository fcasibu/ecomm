import { clientEnv } from '@/env/client';
import { lazy } from '@ecomm/lib/lazy';
import { liteClient } from 'algoliasearch/lite';

export const algoliaSearchClient = lazy(() =>
  liteClient(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    clientEnv.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  ),
);
