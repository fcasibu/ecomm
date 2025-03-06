import { CategoryUpdateForm } from "@/features/categories/components/category-update-form";
import {
  getCategoriesPath,
  getCategoryById,
} from "@/features/categories/services/queries";
import { notFound } from "next/navigation";

export async function CategoryDetail({
  categoryId,
}: {
  categoryId: Promise<string>;
}) {
  const id = await categoryId;
  const result = await getCategoryById(id);
  const categoriesPathResultPromise = getCategoriesPath(id);

  if (!result.success) return notFound();

  return (
    <CategoryUpdateForm
      categoriesPathResultPromise={categoriesPathResultPromise}
      category={result.data}
    />
  );
}
