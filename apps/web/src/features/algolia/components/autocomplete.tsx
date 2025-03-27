import type { BaseItem } from '@algolia/autocomplete-core';
import type { AutocompleteOptions } from '@algolia/autocomplete-js';

import { createElement, Fragment, useEffect, useRef } from 'react';
import { createRoot, type Root } from 'react-dom/client';

import { autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js';
import { algoliaSearchClient } from '../algolia-search-client';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import type { AlgoliaProductHit } from '../types';
import { algoliaKeys } from '../utils/algolia-keys';
import { Button } from '@ecomm/ui/button';
import { ChevronRight, Search, Tag } from 'lucide-react';
import { ImageComponent } from '@ecomm/ui/image';
import { useStore } from '@/features/store/providers/store-provider';
import { formatPrice } from '@ecomm/lib/format-price';
import { link } from '@/lib/utils/link-helper';
import { useRouter } from 'next/navigation';

const { search } = algoliaSearchClient();

export function Autocomplete({
  className,
  ...autocompleteProps
}: Partial<AutocompleteOptions<BaseItem>> & {
  className?: string;
}) {
  const store = useStore();
  const t = useScopedI18n('autocomplete');
  const locale = useCurrentLocale();
  const autocompleteContainer = useRef<HTMLDivElement>(null);
  const panelRootRef = useRef<Root | null>(null);
  const router = useRouter();
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!autocompleteContainer.current) {
      return;
    }

    const autocompleteInstance = autocomplete({
      ...autocompleteProps,
      autoFocus: true,
      container: autocompleteContainer.current,
      renderer: { createElement, Fragment, render: () => {} },
      onStateChange({ state, setIsOpen }) {
        if (!state.isOpen) {
          setIsOpen(true);
        }
      },
      getSources({ query }) {
        if (!query || query.length < 3) {
          return [];
        }

        return [
          {
            sourceId: 'products',
            getItems() {
              return getAlgoliaResults({
                searchClient: search,
                queries: [
                  {
                    indexName: algoliaKeys.product.main(locale),
                    params: {
                      query,
                      hitsPerPage: 4,
                    },
                  },
                ],
              });
            },
            onSelect({ item }) {
              const hit = item as unknown as AlgoliaProductHit;

              router.push(link.product.single(hit.name, hit.sku));
            },
            templates: {
              header({ state }) {
                if (!state.query) return '';

                return (
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-bold">
                      {t('results', { query: state.query })}
                    </p>
                    <Button
                      variant="outline"
                      type="button"
                      className="flex items-center gap-2"
                      onClick={() =>
                        router.push(`/${locale}${link.search(state.query)}`)
                      }
                    >
                      {t('actions.viewAll')}
                      <ChevronRight size="{15}" />
                    </Button>
                  </div>
                );
              },
              item({ item }) {
                const hit = item as unknown as AlgoliaProductHit;

                return <ProductHit hit={hit} currency={store.currency} />;
              },
              noResults({ state }) {
                if (!state.query) return '';

                return <NoResults query={state.query} t={t} />;
              },
            },
          },
        ];
      },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;
          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
    });

    return () => autocompleteInstance.destroy();
  }, [autocompleteProps, locale, t, store.currency, router]);

  return <div className={className} ref={autocompleteContainer} />;
}

function ProductHit({
  hit,
  currency,
}: {
  hit: AlgoliaProductHit;
  currency: string;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-3">
      <ImageComponent
        src={hit.image}
        alt={hit.name}
        width={80}
        height={80}
        quality={25}
        className="aspect-square flex-shrink-0 overflow-hidden rounded-lg object-cover"
      />
      <div className="flex flex-col gap-2 text-sm">
        <span>{hit.name}</span>
        <span className="font-bold">
          {formatPrice(hit.price.value, currency)}
        </span>
      </div>
    </div>
  );
}

function NoResults({
  query,
  t,
}: {
  query: string;
  t: ReturnType<typeof useScopedI18n>;
}) {
  return (
    <div className="mx-auto flex max-w-[450px] flex-col gap-6">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-muted rounded-full p-4">
          <Search size={30} />
        </div>
        <div className="flex flex-col gap-2 text-center">
          <p className="text-lg font-bold">{t('noResult.title', { query })}</p>
          <p className="text-muted-foreground text-sm">
            {t('noResult.description')}
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">{t('noResult.suggestions.title')}:</span>
        <ul>
          <Suggestion>{t('noResult.suggestions.suggestionOne')}</Suggestion>
          <Suggestion>{t('noResult.suggestions.suggestionTwo')}</Suggestion>
          <Suggestion>{t('noResult.suggestions.suggestionThree')}</Suggestion>
        </ul>
      </div>
    </div>
  );
}

function Suggestion({ children }: React.PropsWithChildren) {
  return (
    <li className="text-muted-foreground flex items-center gap-2 text-sm [&_svg]:!size-4">
      <Tag />
      {children}
    </li>
  );
}
