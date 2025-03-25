'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { algoliaSearchClient } from '../algolia-search-client';
import { useCurrentLocale } from '@/locales/client';
import { algoliaKeys } from '../utils/algolia-keys';
import { VirtualAlgoliaConfigure } from '../hooks/virtuals';

const client = algoliaSearchClient();

export function InstantSearchProductProvider({
  children,
  filters,
}: {
  children: React.ReactNode;
  filters: string;
}) {
  const locale = useCurrentLocale();

  return (
    <InstantSearchNext
      indexName={algoliaKeys.product.index(locale)}
      searchClient={client}
    >
      <VirtualAlgoliaConfigure filters={filters} />
      {children}
    </InstantSearchNext>
  );
}
