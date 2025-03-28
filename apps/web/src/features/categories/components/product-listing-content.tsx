'use client';

import type { AlgoliaProductHit } from '@/features/algolia/types';
import { renderRichText } from '@/lib/utils/render-rich-text';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Grid2x2, Grid3X3, List } from 'lucide-react';
import { useState } from 'react';
import { useHits } from 'react-instantsearch-core';
import { ProductHits } from './product-hits';
import { ProductFilters } from './product-filters';
import { ProductFiltersMobile } from './product-filters-mobile';
import { ProductNoResults } from './product-no-results';
import { ProductSortBy } from './product-sort-by';
import { ProductListingPagination } from './product-listing-pagination';

export function ProductListingContent() {
  const { results } = useHits<AlgoliaProductHit>();
  const t = useScopedI18n('productListing');
  const [gridLayout, setGridLayout] = useState<'1x1' | '2x2' | '3x3'>('3x3');

  const hits = results?.hits ?? [];

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      <ProductFiltersMobile />
      <div className="hidden basis-[350px] lg:block">
        <ProductFilters />
      </div>
      <div className="flex-1">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted-foreground text-sm">
            {Boolean(results?.hits.length) &&
              Boolean(results?.nbHits) &&
              renderRichText(
                t('showing', {
                  count: results?.hits.length,
                  total: results?.nbHits,
                }),
                {
                  bold1: (props) => <b {...props} />,
                  bold2: (props) => <b {...props} />,
                },
              )}
          </span>
          <div className="flex items-center gap-4">
            <ProductSortBy />
            <div className="border-input hidden rounded-lg border lg:block">
              <Button
                aria-label={t('actions.gridLayout.one')}
                type="button"
                variant="outline"
                className="border-none"
                onClick={() => setGridLayout('1x1')}
              >
                <List aria-hidden />
              </Button>
              <Button
                aria-label={t('actions.gridLayout.two')}
                type="button"
                variant="outline"
                className="border-none"
                onClick={() => setGridLayout('2x2')}
              >
                <Grid2x2 aria-hidden />
              </Button>
              <Button
                aria-label={t('actions.gridLayout.three')}
                type="button"
                variant="outline"
                className="border-none"
                onClick={() => setGridLayout('3x3')}
              >
                <Grid3X3 aria-hidden />
              </Button>
            </div>
          </div>
        </div>
        {hits.length ? (
          <div>
            <ProductHits gridLayout={gridLayout} hits={hits} />
            <ProductListingPagination />
          </div>
        ) : (
          <ProductNoResults />
        )}
      </div>
    </div>
  );
}
