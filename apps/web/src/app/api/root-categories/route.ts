import { getRootCategories } from '@/features/categories/services/queries';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale');

  if (!locale) {
    return new Response('Missing locale', { status: 400 });
  }

  const result = await getRootCategories(locale);

  return NextResponse.json(result);
}
