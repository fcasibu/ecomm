'use client';

import {
  useConfigure,
  useRange,
  useRefinementList,
  useSortBy,
  type UseConfigureProps,
  type UseRangeProps,
  type UseRefinementListProps,
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
