import 'server-only';

import { getServerContext } from '@/lib/utils/server-context';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { cartController } from '@ecomm/services/registry';

export async function getCart() {
  const context = await getServerContext();
  const result = await executeOperation(() =>
    cartController().findCart(context),
  );

  return result;
}
