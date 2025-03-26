import { algoliaWriteClient } from '@/features/algolia/algolia-write-client';
import { getNonRootCategories } from '@/features/categories/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { isDefined } from '@ecomm/lib/is-defined';
import type { CategoryDTO } from '@ecomm/services/categories/category-dto'; // Assuming this exists
import { NextResponse } from 'next/server';
import assert from 'node:assert';

const client = algoliaWriteClient();

function transformCategoryForAlgolia(category: CategoryDTO) {
  assert(category.slug, 'Category must have a slug');

  return {
    objectID: category.slug,
    id: category.id,
    name: category.name,
    description: category.description || '',
    image: category.image || '',
    slug: category.slug,
    parentId: category.parentId || null,
    updatedAt: category.updatedAt,
    createdAt: category.createdAt,
  };
}

async function syncCategoriesToAlgolia(
  locale: string,
  categories: CategoryDTO[],
) {
  const envName =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';
  const indexName = `${envName}_categories_${locale}`;

  try {
    const objects = categories
      .map(transformCategoryForAlgolia)
      .filter(isDefined);

    if (objects.length === 0) {
      return { success: true, message: 'No valid categories to sync' };
    }

    await client.partialUpdateObjects({
      indexName,
      objects,
      createIfNotExists: true,
    });

    return { success: true, message: `Synced ${objects.length} categories` };
  } catch (error) {
    console.error('Error syncing categories to Algolia:', error);
    return { success: false, error: 'Failed to sync categories to Algolia' };
  }
}

// TODO(fcasibu): make it secure
export async function GET() {
  const locale = await getCurrentLocale();
  const result = await getNonRootCategories(locale);

  if (!result.success) {
    return NextResponse.json(result);
  }

  const categories = result.data;
  if (categories.length === 0) {
    return NextResponse.json({ success: true, message: 'No categories found' });
  }

  const syncResult = await syncCategoriesToAlgolia(locale, categories);
  return NextResponse.json(syncResult);
}
