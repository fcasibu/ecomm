import { ProductDetail } from '@/features/products/components/product-detail';
import { getProductBySku } from '@/features/products/services/queries';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ sku: string; locale: string }>;
}) {
  const { sku, locale } = await params;
  const result = await getProductBySku(locale, sku);
  setStaticParamsLocale(locale);

  if (!result.success || !result.data.variants.length) return notFound();

  return <ProductDetail product={result.data} selectedSku={sku} />;
}
