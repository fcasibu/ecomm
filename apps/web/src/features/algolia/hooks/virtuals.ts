'use client';

import {
  useConfigure,
  usePagination,
  useRange,
  useRefinementList,
  useSearchBox,
  useSortBy,
  type UseConfigureProps,
  type UsePaginationProps,
  type UseRangeProps,
  type UseRefinementListProps,
  type UseSearchBoxProps,
  type UseSortByProps,
} from 'react-instantsearch-core';

export function VirtualAlgoliaConfigure(props: UseConfigureProps) {
  useConfigure(props);

  return null;
}

export function VirtualRange(props: UseRangeProps) {
  useRange(props);

  return null;
}

export function VirtualRefinementList(props: UseRefinementListProps) {
  useRefinementList(props);

  return null;
}

export function VirtualSortBy(props: UseSortByProps) {
  useSortBy(props);

  return null;
}

export function VirtualPagination(props: UsePaginationProps) {
  usePagination(props);

  return null;
}

export function VirtualSearchBox(props: UseSearchBoxProps) {
  useSearchBox(props);

  return null;
}
