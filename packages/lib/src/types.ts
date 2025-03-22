import type { Locale } from './locale-helper';

export interface ServerContext {
  user: {
    anonymousId: string | null | undefined;
    customerId: string | null | undefined;
  };
  cart: {
    id: string | null | undefined;
  };
  locale: Locale;
}
