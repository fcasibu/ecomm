'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { algoliaSearchClient } from '../algolia-search-client';
import { useCurrentLocale } from '@/locales/client';
import { algoliaKeys } from '../utils/algolia-keys';

const client = algoliaSearchClient();

export function InstantSearchCategoryProvider({
  children,
}: React.PropsWithChildren) {
  const locale = useCurrentLocale();

  return (
    <InstantSearchNext
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      indexName={algoliaKeys.category.index(locale)}
      searchClient={client}
    >
      {children}
    </InstantSearchNext>
  );
}
