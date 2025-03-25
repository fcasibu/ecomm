'use client';

import {
  useConfigure,
  useRange,
  useRefinementList,
  type UseConfigureProps,
  type UseRangeProps,
  type UseRefinementListProps,
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
