import { InstantSearchQueryProvider } from '@/features/algolia/providers/instant-search-query-provider';

export default function Layout({ children }: React.PropsWithChildren) {
  return <InstantSearchQueryProvider>{children}</InstantSearchQueryProvider>;
}
