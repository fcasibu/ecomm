import 'server-only';

import { cookies } from 'next/headers';
import { getCurrentLocale } from '@/locales/server';
import { cache } from 'react';
import type { ServerContext } from '@ecomm/lib/types';
import { cookieKeys } from './cookie-keys';
import { auth } from '@clerk/nextjs/server';

// NOTE(fcasibu): This is only used in dynamic environments (not using cache)
export const getServerContext = cache(async (): Promise<ServerContext> => {
  const [cookie, locale] = await Promise.all([cookies(), getCurrentLocale()]);
  const userId = (await auth())?.userId;

  return {
    locale,
    cart: {
      id: cookie.get(cookieKeys.cart.cartId(locale))?.value,
    },
    user: {
      anonymousId:
        cookie.get(cookieKeys.customer.anonymousId(locale))?.value || null,
      customerId: userId ?? null,
    },
  };
});
