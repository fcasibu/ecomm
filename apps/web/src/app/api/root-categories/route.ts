import { getRootCategories } from '@/features/categories/services/queries';
import { getCurrentLocale } from '@/locales/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getRootCategories(await getCurrentLocale());

  return NextResponse.json(result);
}
