import { NextLink } from '@/components/link';
import { link } from '@/lib/utils/link-helper';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { Button } from '@ecomm/ui/button';

const MAX_SUB_CATEGORIES = 6;

export function SubCategories({
  subCategories,
}: {
  subCategories: CategoryDTO['children'];
}) {
  return (
    <div className="flex justify-center gap-2 py-2">
      {subCategories.slice(0, MAX_SUB_CATEGORIES).map((subCategory) => (
        <Button
          key={subCategory.id}
          type="button"
          variant="outline"
          className="flex h-full min-w-24 items-center gap-2 rounded-full px-3 py-1 !text-xs hover:no-underline"
          asChild
        >
          <NextLink href={link.category.single(subCategory.slug)} prefetch>
            {subCategory.name}
          </NextLink>
        </Button>
      ))}
    </div>
  );
}
