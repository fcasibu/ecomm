import { notFound } from 'next/navigation';
import { getProductById } from '../services/queries';
import { ProductUpdateForm } from './product-update-form';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';

export async function ProductDetail({
  productId,
}: {
  productId: Promise<string>;
}) {
  const locale = await getCookieCurrentLocale();
  const result = await getProductById(locale, await productId);

  if (!result.success) return notFound();

  return <ProductUpdateForm product={result.data} />;
}
