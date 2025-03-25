import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { CategoryHeading } from './category-heading';
import { ProductListingContent } from './product-listing-content';

export function ProductListing({ category }: { category: CategoryDTO }) {
  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="container">
        <CategoryHeading category={category} />
      </div>
      <div className="container">
        <ProductListingContent />
      </div>
    </div>
  );
}
