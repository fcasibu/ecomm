import { clientEnv } from '@/env/client';
import { serverEnv } from '@/env/server';
import { getNonRootCategories } from '@/features/categories/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { algoliasearch } from 'algoliasearch';
import { NextResponse } from 'next/server';

const client = algoliasearch(
  clientEnv.NEXT_PUBLIC_ALGOLIA_APP_ID,
  serverEnv.ALGOLIA_WRITE_KEY,
);

// TODO(fcasibu): create service for algolia / make it secure
export async function GET() {
  const locale = await getCurrentLocale();
  const result = await getNonRootCategories(locale);

  if (!result.success) {
    return NextResponse.json(result);
  }

  const categories = result.data;

  if (!categories.length) {
    return NextResponse.json({ success: true, message: 'No categories found' });
  }

  const envName =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  client.partialUpdateObjects({
    indexName: `${envName}_categories_${locale}`,
    objects: categories.map((category) => ({
      objectID: category.slug,
      id: category.id,
      name: category.name,
      description: category.description,
      image: category.image,
      slug: category.slug,
      parentId: category.parentId,
      updatedAt: category.updatedAt,
      createdAt: category.createdAt,
    })),
    createIfNotExists: true,
  });

  return NextResponse.json({
    success: true,
    message: `Synced ${categories.length} categories`,
  });
}
