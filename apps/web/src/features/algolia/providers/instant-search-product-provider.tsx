'use client';

import { InstantSearchNext } from 'react-instantsearch-nextjs';
import { algoliaSearchClient } from '../algolia-search-client';
import { useCurrentLocale } from '@/locales/client';
import { algoliaKeys } from '../utils/algolia-keys';
import {
  VirtualAlgoliaConfigure,
  VirtualRange,
  VirtualRefinementList,
  VirtualSortBy,
} from '../hooks/virtuals';
import { ATTRIBUTES_FOR_FACETING } from '../utils/attributes-for-faceting';
import { getProductSortByOptions } from '../utils/get-sort-by-options';

const client = algoliaSearchClient();

export function InstantSearchProductProvider({
  children,
  filters,
}: {
  children: React.ReactNode;
  filters: string;
}) {
  const locale = useCurrentLocale();

  const sortByOptions = getProductSortByOptions(locale);

  return (
    <InstantSearchNext
      future={{
        preserveSharedStateOnUnmount: true,
      }}
      indexName={algoliaKeys.product.index(locale)}
      searchClient={client}
      routing
    >
      <VirtualAlgoliaConfigure filters={filters} />
      {ATTRIBUTES_FOR_FACETING['range'].map((item) => (
        <VirtualRange key={item.attribute} attribute={item.attribute} />
      ))}
      {ATTRIBUTES_FOR_FACETING['checkbox'].map((item) => (
        <VirtualRefinementList
          key={item.attribute}
          attribute={item.attribute}
        />
      ))}
      <VirtualSortBy items={sortByOptions} />
      {children}
    </InstantSearchNext>
  );
}
