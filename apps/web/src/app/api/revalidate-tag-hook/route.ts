import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { serverEnv } from '@/env/server';
import { logger } from '@ecomm/lib/logger';
import type { SanityDocument } from 'next-sanity';

export async function POST(request: NextRequest) {
  const { body, isValidSignature } = await parseBody<
    SanityDocument<{ slug: string }>
  >(request, serverEnv.SANITY_WEBHOOK_SECRET);

  if (!isValidSignature) {
    logger.warn({ body }, 'Invalid signature');
    return NextResponse.json({
      success: false,
      error: 'Invalid signature',
      timestamp: Date.now(),
    });
  }

  const { _type, slug } = body ?? {};

  logger.info(`Revalidation, received: _type: ${_type}, slug: ${slug}`);

  if (_type !== 'contentPage') {
    logger.warn(`Received incorrect document type`);

    return NextResponse.json({
      success: false,
      error: `Document type must be "contentPage"`,
      timestamp: Date.now(),
    });
  }

  logger.info(`Revalidating content page tag: ${slug}`);

  revalidateTag(`content_page_${slug}`);

  return NextResponse.json({
    success: true,
    revalidatedTag: slug,
    timestamp: Date.now(),
  });
}
