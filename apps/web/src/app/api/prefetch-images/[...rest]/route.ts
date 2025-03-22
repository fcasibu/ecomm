import { NextRequest, NextResponse } from 'next/server';
import { parseHTML } from 'linkedom';
import { getStorefrontBaseURL } from '@/lib/utils/get-storefront-url';

export const dynamic = 'force-static';

const STOREFRONT_BASE_URL = getStorefrontBaseURL();

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> },
) {
  if (!STOREFRONT_BASE_URL) {
    return NextResponse.json(
      { error: 'Failed to get url from env' },
      { status: 500 },
    );
  }

  const href = (await params).rest.join('/');
  if (!href) {
    return NextResponse.json(
      { error: 'Missing url parameter' },
      { status: 400 },
    );
  }

  const url = `${STOREFRONT_BASE_URL}/${href.startsWith('/') ? href.slice(1) : href}`;
  const response = await fetch(url);
  if (!response.ok) {
    return NextResponse.json(
      {
        error: 'Failed to fetch',
      },
      { status: response.status },
    );
  }

  const body = await response.text();
  const { document } = parseHTML(body);

  const images = Array.from(document.querySelectorAll('main img')).flatMap(
    (img) => {
      const src = img.getAttribute('src');
      if (!src) return [];

      return {
        srcset: img.getAttribute('srcset') || img.getAttribute('srcSet'),
        sizes: img.getAttribute('sizes'),
        src,
        alt: img.getAttribute('alt'),
        loading: img.getAttribute('loading'),
      };
    },
  );

  return NextResponse.json(
    { images },
    {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    },
  );
}
