import { clientEnv } from '@/env/client';
import { lazy } from '@ecomm/lib/lazy';
import { liteClient } from 'algoliasearch/lite';
import { querySuggestionsClient } from '@algolia/client-query-suggestions';

export const algoliaSearchClient = lazy(() => ({
  search: liteClient(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    clientEnv.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
  ),

  querySuggestions: querySuggestionsClient(
    clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
    clientEnv.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY,
    'us',
  ),
}));
