import { CartDetails } from '@/features/cart/components/cart-details';
import { getCart } from '@/features/cart/services/queries';
import { connection } from 'next/server';

export default async function Page() {
  await connection();

  const result = await getCart();

  return <CartDetails cart={result.success ? result.data : {}} />;
}
