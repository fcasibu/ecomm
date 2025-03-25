'use client';

import { useConfigure, type UseConfigureProps } from 'react-instantsearch-core';

export function VirtualAlgoliaConfigure(props: UseConfigureProps) {
  useConfigure(props);

  return null;
}
