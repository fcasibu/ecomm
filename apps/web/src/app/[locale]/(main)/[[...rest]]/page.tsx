import { notFound } from 'next/navigation';
import { generateContentPageMetadata } from './_metadata';
import { getContentPage } from '@/sanity/queries/content-page/get-content-page';
import { getContentPages } from '@/sanity/queries/content-page/get-content-pages';
import { setStaticParamsLocale } from 'next-international/server';
import { ContentPage } from '@/components/content-page';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  return await generateContentPageMetadata(params);
}

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  const result = await getContentPages(locale);

  if (!result.success) return [];

  return result.data.map((contentPage) => ({
    locale,
    rest: [contentPage.slug],
  }));
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
  setStaticParamsLocale(locale);

  const result = await getContentPage(locale, slug);

  if (!result.success) return notFound();

  return <ContentPage contentPage={result.data} />;
}
