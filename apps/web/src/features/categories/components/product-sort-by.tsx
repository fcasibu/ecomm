'use client';

import {
  getProductSortByOptions,
  type SortByLabel,
} from '@/features/algolia/utils/get-sort-by-options';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { useSortBy } from 'react-instantsearch-core';
import { Button } from '@ecomm/ui/button';
import { AlignCenter, SortAsc, SortDesc } from 'lucide-react';
import { dynamicImport } from '@/lib/utils/dynamic-import';
import { useSearchParams } from 'next/navigation';

const {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} = dynamicImport(
  () => import('@ecomm/ui/dropdown-menu'),
  {
    DropdownMenu: {
      loading: () => <MenuTriggerSkeleton />,
    },
    DropdownMenuContent: null,
    DropdownMenuItem: {
      ssr: true,
    },
    DropdownMenuTrigger: {
      loading: () => <MenuTriggerSkeleton />,
    },
  },
  { ssr: false },
);

const SORT_BY_ICONS = {
  main: AlignCenter,
  priceAsc: SortAsc,
  priceDesc: SortDesc,
} as const satisfies Record<SortByLabel, React.ElementType>;

export function ProductSortBy() {
  const locale = useCurrentLocale();
  const sortBy = useSortBy({
    items: getProductSortByOptions(locale),
  });
  const t = useScopedI18n('productListing.sortBy');

  const selectedOption = sortBy.options.find(
    (option) => option.value === sortBy.currentRefinement,
  );

  const label = selectedOption?.label as SortByLabel;
  const SelectedIcon = SORT_BY_ICONS[label];

  return (
    <DropdownMenu>
      <Button variant="outline" asChild type="button">
        <DropdownMenuTrigger>
          {t(label)}
          {SelectedIcon && <SelectedIcon />}
        </DropdownMenuTrigger>
      </Button>
      <DropdownMenuContent>
        {sortBy.options.map((option) => {
          const Icon = SORT_BY_ICONS[option.label as SortByLabel];

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

function MenuTriggerSkeleton() {
  const searchParams = useSearchParams();
  const t = useScopedI18n('productListing.sortBy');

  const sortByOption = (searchParams.get('sort_by') ?? 'main') as SortByLabel;

  const SelectedIcon = SORT_BY_ICONS[sortByOption];

  return (
    <Button variant="outline" asChild type="button">
      <div>
        {t(sortByOption)}
        {SelectedIcon && <SelectedIcon />}
      </div>
    </Button>
  );
}
