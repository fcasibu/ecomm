'use client';

import {
  getProductSortByOptions,
  type SortByLabel,
} from '@/features/algolia/utils/get-sort-by-options';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { useSortBy } from 'react-instantsearch-core';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@ecomm/ui/dropdown-menu';
import { Button } from '@ecomm/ui/button';
import { AlignCenter, SortAsc, SortDesc } from 'lucide-react';

const SORT_BY_ICONS = {
  main: AlignCenter,
  priceAsc: SortAsc,
  priceDesc: SortDesc,
} as const;

export function ProductSortBy() {
  const locale = useCurrentLocale();
  const sortBy = useSortBy({
    items: getProductSortByOptions(locale),
  });
  const t = useScopedI18n('productListing.sortBy');

  const selectedOption = sortBy.options.find(
    (option) => option.value === sortBy.currentRefinement,
  );

  const SelectedIcon =
    SORT_BY_ICONS[selectedOption?.label as keyof typeof SORT_BY_ICONS];

  return (
    <DropdownMenu>
      <Button variant="outline" asChild type="button">
        <DropdownMenuTrigger>
          {t(selectedOption?.label as SortByLabel)}
          {SelectedIcon && <SelectedIcon />}
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        {sortBy.options.map((option) => {
          const Icon =
            SORT_BY_ICONS[option.label as keyof typeof SORT_BY_ICONS];

          return (
            <DropdownMenuItem
              key={option.label}
              onClick={() => sortBy.refine(option.value)}
            >
              {t(option.label as SortByLabel)}
              {Icon && <Icon />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
