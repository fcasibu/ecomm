import { CartSheet } from '@/features/cart/components/cart-sheet';
import { getCart } from '@/features/cart/services/queries';

export default async function Cart() {
  const result = await getCart();

  return <CartSheet cart={result.success ? result.data : null} />;
}
