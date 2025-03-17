import { getImages } from '@/features/image/services/queries';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getImages();

  return NextResponse.json(result);
}
