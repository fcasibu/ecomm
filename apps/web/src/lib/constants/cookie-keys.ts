import { toUnderscoreLocale } from '../utils/locale-helper';

export const cookieKeys = {
  customer: {
    anonymousId: (locale: string) =>
      `anonymous_id_${toUnderscoreLocale(locale)}`,
  },
  cart: {
    cartId: (locale: string) => `cart_id_${toUnderscoreLocale(locale)}`,
  },
} as const;
