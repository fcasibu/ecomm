import { ProductListingContent } from '@/features/categories/components/product-listing-content';
import { SearchHeading } from '@/features/search/components/search-heading';

export async function SearchListing({ query }: { query: string }) {
  return (
    <div className="flex flex-col gap-8 py-6">
      <div className="container">
        <SearchHeading query={query} />
      </div>
      <div className="container">
        <ProductListingContent />
      </div>
    </div>
  );
}
