'use client';

import { useHits } from 'react-instantsearch-core';

export default function Page() {
  const { hits } = useHits();

  console.log(hits);

  return <div>Categories</div>;
}
