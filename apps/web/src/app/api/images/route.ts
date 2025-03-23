import { getImages } from '@/features/image/services/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor');

  const result = await getImages(cursor ?? '');

  return NextResponse.json(result);
}
