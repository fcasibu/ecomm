import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { CategoryHeading } from './category-heading';
import { ProductListingContent } from './product-listing-content';
import { SubCategories } from './product-subcategories';

export function ProductListing({ category }: { category: CategoryDTO }) {
  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="container flex flex-col gap-3">
        <CategoryHeading category={category} />
        <SubCategories subCategories={category.children ?? []} />
      </div>
      <div className="container">
        <ProductListingContent />
      </div>
    </div>
  );
}
