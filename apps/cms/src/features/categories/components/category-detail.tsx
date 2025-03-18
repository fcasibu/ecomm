import { CategoryUpdateForm } from '@/features/categories/components/category-update-form';
import {
  getCategoriesPath,
  getCategoryById,
} from '@/features/categories/services/queries';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';
import { notFound } from 'next/navigation';

export async function CategoryDetail({
  categoryId,
}: {
  categoryId: Promise<string>;
}) {
  const id = await categoryId;
  const locale = await getCookieCurrentLocale();
  const result = await getCategoryById(locale, id);
  const categoriesPathResultPromise = getCategoriesPath(locale, id);

  if (!result.success) return notFound();

  return (
    <CategoryUpdateForm
      categoriesPathResultPromise={categoriesPathResultPromise}
      category={result.data}
    />
  );
}
