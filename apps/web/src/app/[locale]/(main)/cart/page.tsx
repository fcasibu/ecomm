import { CartDetails } from '@/features/cart/components/cart-details';
import { CartEmpty } from '@/features/cart/components/cart-empty';
import { getCart } from '@/features/cart/services/queries';
import { connection } from 'next/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
  await connection();

  const result = await getCart();

  return result.success && result.data.items.length ? (
    <CartDetails cart={result.data} />
  ) : (
    <CartEmpty />
  );
}
