import { getProductsBySkus } from '@/features/products/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const locale = await getCurrentLocale();
  const searchParams = request.nextUrl.searchParams;
  const skus = searchParams.get('skus')?.split(',') ?? [];

  const result = await getProductsBySkus(locale, skus);

  return NextResponse.json(result);
}
