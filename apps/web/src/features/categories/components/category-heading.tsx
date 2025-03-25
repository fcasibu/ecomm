import { toTitleCase } from '@ecomm/lib/transformers';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto';
import { Heading } from '@ecomm/ui/typography';

export function CategoryHeading({ category }: { category: CategoryDTO }) {
  return (
    <div className="flex flex-col gap-2 text-center">
      <Heading as="h1" className="!text-3xl">
        {toTitleCase(category.name)}
      </Heading>
      <p className="text-muted-foreground text-sm">{category.description}</p>
    </div>
  );
}
