import { toUnderscoreLocale, type Locale } from '@ecomm/lib/locale-helper';

export const cookieKeys = {
  customer: {
    anonymousId: (locale: Locale) =>
      `anonymous_id_${toUnderscoreLocale(locale)}` as const,
    onboarding: (locale: Locale) =>
      `onboarding_${toUnderscoreLocale(locale)}` as const,
  },
  cart: {
    cartId: (locale: Locale) =>
      `cart_id_${toUnderscoreLocale(locale)}` as const,
  },
} as const;
