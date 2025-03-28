import { SearchHeading } from '@/features/search/components/search-heading';
import { SearchListing } from '@/features/search/components/search-listing';
import { SearchNoResults } from '@/features/search/components/search-no-results';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const query = (await searchParams).query;

  if (!query) {
    return (
      <div className="flex flex-col gap-8 py-6">
        <div className="container">
          <SearchHeading query={query} />
        </div>
        <div className="container">
          <SearchNoResults />
        </div>
      </div>
    );
  }

  return <SearchListing query={query} />;
}
