import { CartSheet } from '@/features/cart/components/cart-sheet';
import { getCart } from '@/features/cart/services/queries';
import { connection } from 'next/server';

export const dynamic = 'force-dynamic';

export default async function Cart() {
  await connection();

  const result = await getCart();

  return <CartSheet cart={result.success ? result.data : null} />;
}
