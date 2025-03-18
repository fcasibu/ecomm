import { NextRequest, NextResponse } from 'next/server';
import { parseHTML } from 'linkedom';

export const dynamic = 'force-static';

function getHostname() {
  if (process.env.NODE_ENV === 'development') {
    return 'localhost:3001';
  }
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }
  return process.env.VERCEL_BRANCH_URL ?? 'localhost:3001';
}

const HOSTNAME = getHostname();

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ rest: string[] }> },
) {
  const schema = 'http';

  if (!HOSTNAME) {
    return NextResponse.json(
      { error: 'Failed to get hostname from env' },
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

  const url = `${schema}://${HOSTNAME}/${href}`;
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
