import { getNewArrivalsByCategoryId } from '@/features/products/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const categoryId = request.nextUrl.searchParams.get('category');

  if (!categoryId) {
    return NextResponse.json({
      success: false,
      error: 'Category ID is required.',
    });
  }

  const result = await getNewArrivalsByCategoryId(
    await getCurrentLocale(),
    categoryId,
  );

  return NextResponse.json(result);
}
