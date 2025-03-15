'use server';

import 'server-only';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { storeController } from '@ecomm/services/registry';
import { revalidateTag } from 'next/cache';
import type { StoreCreateInput } from '@ecomm/validations/cms/store/store-schema';
import { cookies } from 'next/headers';
import { STORE_CURRENT_LOCALE_COOKIE_KEY } from '../constants';
import { getCookieCurrentLocale } from '@/lib/get-cookie-current-locale';

export const createStore = async (input: StoreCreateInput) => {
  const result = await executeOperation(() => storeController.create(input));

  if (result.success) {
    revalidateTag(`store_${result.data.locale}`);
  }

  return result;
};

export const deleteStoreById = async (id: string) => {
  const result = await executeOperation(() => storeController.delete(id));

  if (result.success) {
    const currentLocale = await getCookieCurrentLocale();

    if (result.data.locale === currentLocale) {
      (await cookies()).set(STORE_CURRENT_LOCALE_COOKIE_KEY, 'en-US');
    }

    revalidateTag(`store_${result.data.locale}`);
    revalidateTag('stores');
  }

  return result;
};
