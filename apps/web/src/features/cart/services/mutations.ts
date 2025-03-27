'use server';

import { getServerContext } from '@/lib/utils/server-context';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { cartController } from '@ecomm/services/registry';
import type { AddToCartInput } from '@ecomm/validations/web/cart/add-to-cart-schema';
import type { UpdateDeliveryPromiseSelectionInput } from '@ecomm/validations/web/cart/update-delivery-promise-selection-schema';
import type { UpdateItemQuantityInput } from '@ecomm/validations/web/cart/update-item-quantity-schema';

export async function addToCart(data: AddToCartInput) {
  const context = await getServerContext();
  const result = await executeOperation(() =>
    cartController().addToCart(context, data),
  );

  return result;
}

export async function updateItemQuantity(data: UpdateItemQuantityInput) {
  const context = await getServerContext();
  const result = await executeOperation(() =>
    cartController().updateItemQuantity(context, data.itemId, data.newQuantity),
  );

  return result;
}

export async function updateItemDeliveryPromise(
  data: UpdateDeliveryPromiseSelectionInput,
) {
  const context = await getServerContext();
  const result = await executeOperation(() =>
    cartController().updateItemDeliveryPromise(context, data),
  );

  return result;
}
