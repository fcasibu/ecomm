import { notFound } from 'next/navigation';
import { CustomerUpdateForm } from './customer-update-form';
import { getCustomerById } from '../services/queries';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';

export async function CustomerDetail({
  param,
}: {
  param: Promise<{ id: string; tab?: string }>;
}) {
  const { id, tab } = await param;
  const locale = await getCookieCurrentLocale();
  const result = await getCustomerById(locale, id);

  if (!result.success) return notFound();

  return <CustomerUpdateForm tab={tab} customer={result.data} />;
}
