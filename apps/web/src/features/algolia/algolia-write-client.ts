import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import { lazy } from '@ecomm/lib/lazy';
import { algoliasearch } from 'algoliasearch';
import { querySuggestionsClient } from '@algolia/client-query-suggestions';

export const algoliaWriteClient = lazy(() => ({
  search: algoliasearch(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    serverEnv.ALGOLIA_WRITE_KEY,
  ),

  querySuggestions: querySuggestionsClient(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    serverEnv.ALGOLIA_WRITE_KEY,
    'us',
  ),
}));
