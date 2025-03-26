'use client';

import {
  InstantSearchNext,
  type InstantSearchNextProps,
} from 'react-instantsearch-nextjs';
import { algoliaSearchClient } from '../algolia-search-client';
import { useCurrentLocale } from '@/locales/client';
import { algoliaKeys } from '../utils/algolia-keys';
import {
  VirtualAlgoliaConfigure,
  VirtualPagination,
  VirtualRange,
  VirtualRefinementList,
  VirtualSortBy,
} from '../hooks/virtuals';
import {
  ATTRIBUTES_FOR_FACETING,
  type Attribute,
} from '../utils/attributes-for-faceting';
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
      routing={createRouting(
        sortByOptions,
        Object.values(ATTRIBUTES_FOR_FACETING).flat(),
        algoliaKeys.product.index(locale),
      )}
    >
      <VirtualPagination />
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

type Routing = Exclude<InstantSearchNextProps['routing'], boolean | undefined>;
type StateMapping = NonNullable<Routing['stateMapping']>;
type UiState = ReturnType<StateMapping['stateToRoute']>;

function createRouting(
  sortByOptions: ReturnType<typeof getProductSortByOptions>,
  refinementFilters: Attribute[],
  algoliaProductsIndex: string,
) {
  const refinementList = refinementFilters.filter(
    (filter) => filter.attribute !== 'price.value',
  );

  return {
    stateMapping: {
      stateToRoute(uiState) {
        const indexUiState = uiState[algoliaProductsIndex];
        const refinementListState: Record<string, string[]> = {};

        for (const { label, attribute } of refinementList) {
          const values = indexUiState?.refinementList?.[attribute];
          if (values?.length) {
            refinementListState[label] = values;
          }
        }

        return {
          sort_by: sortByOptions.find(
            (opt) => opt.value === indexUiState?.sortBy,
          )?.label,
          price_range: indexUiState?.range?.['price.value'],
          page: indexUiState?.page,
          ...refinementListState,
        } as unknown as UiState;
      },
      routeToState(routeState) {
        const refinementListState: Record<string, string[]> = {};

        for (const { label, attribute } of refinementList) {
          const values = routeState[label];
          if (Array.isArray(values) && values.length > 0) {
            refinementListState[attribute] = values;
          }
        }

        return {
          [algoliaProductsIndex]: {
            sortBy: sortByOptions.find(
              (opt) => opt.label === routeState.sort_by,
            )?.value,
            page: routeState.page,
            refinementList: refinementListState,
            range: { 'price.value': routeState.price_range },
          },
        } as unknown as UiState;
      },
    },
  } as const satisfies Routing;
}
