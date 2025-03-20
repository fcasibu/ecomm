import type { Prisma } from '@ecomm/db';
import { randomUUID } from 'crypto';
import type { UserType } from '../cart/cart-service';

interface CartArgsStrategy {
  create(): Partial<Prisma.CartCreateInput>;
}

class NewCustomerArgsStrategy implements CartArgsStrategy {
  constructor(private readonly locale: string) {}

  public create(): Partial<Prisma.CartCreateInput> {
    const anonymousId = randomUUID();

    return {
      anonymousId,
      customer: {
        create: {
          anonymousId,
          store: { connect: { locale: this.locale } },
        },
      },
    };
  }
}

class GuestArgsStrategy implements CartArgsStrategy {
  constructor(private readonly anonymousId: string) {}

  public create(): Partial<Prisma.CartCreateInput> {
    return {
      customer: {
        connect: {
          anonymousId: this.anonymousId,
        },
      },
    };
  }
}

class CustomerArgsStrategy implements CartArgsStrategy {
  constructor(private readonly customerId: string) {}

  public create(): Partial<Prisma.CartCreateInput> {
    return {
      customer: {
        connect: {
          id: this.customerId,
        },
      },
    };
  }
}

interface CartArgsProcessorParam {
  locale: string;
  customerId: string | null | undefined;
  anonymousId: string | null | undefined;
  userType: UserType;
}

export class CartArgsFactory {
  public static create(param: CartArgsProcessorParam) {
    const { userType, anonymousId, customerId, locale } = param;

    switch (userType) {
      case 'new':
        return new NewCustomerArgsStrategy(locale).create();
      case 'guest':
        return new GuestArgsStrategy(anonymousId!).create();
      case 'customer':
        return new CustomerArgsStrategy(customerId!).create();
      default:
        throw new Error(`Unknown user type: ${userType}`);
    }
  }
}
