import { notFound } from 'next/navigation';
import { generateContentPageMetadata } from './_metadata';
import { getContentPage } from '@/sanity/queries/content-page/get-content-page';

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  return generateContentPageMetadata(params);
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale, slug } = await params.then((p) => ({
    slug: p.rest?.at(-1) || '/',
    locale: p.locale,
  }));

  const result = await getContentPage(locale, slug);

  if (!result.success) return notFound();

  return <div>{JSON.stringify(result.data)}</div>;
}
