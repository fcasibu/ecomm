import { getURLFromHeaders } from '@/lib/utils/get-url-from-header';
import { getContentPage } from '@/sanity/queries/content-page/get-content-page';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export async function generateContentPageMetadata(
  params: Promise<{ locale: string; rest: string[] }>,
): Promise<Metadata> {
  const { locale, slug } = await params.then((p) => ({
    slug: p.rest?.at(-1) || '/',
    locale: p.locale,
  }));
  const result = await getContentPage(locale, slug);

  if (!result.success) return notFound();

  const {
    title,
    description,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    indexing,
  } = result.data.seoMetadata;
  const seoURL = getURLFromHeaders(await headers());

  return {
    title: title,
    description: description,
    robots: indexing,
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
    },
    twitter: {
      title: twitterTitle || title,
      description: twitterDescription || description,
    },
    alternates: {
      canonical: seoURL,
    },
  };
}
