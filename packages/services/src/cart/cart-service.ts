import { PrismaClient } from '@ecomm/db';
import type { Prisma, ProductVariant } from '@ecomm/db';
import type {
  CartCreateInput,
  CartUpdateInput,
} from '@ecomm/validations/cms/cart/cart-schema';
import { BaseService } from '../base-service';
import { randomUUID } from 'node:crypto';

export type Cart = Prisma.CartGetPayload<{
  include: {
    items: {
      include: {
        product: {
          include: {
            variants: true;
          };
        };
      };
    };
  };
}>;

const CART_INCLUDE = {
  items: {
    include: {
      product: {
        include: {
          variants: true,
        },
      },
    },
  },
} as const satisfies Prisma.CartInclude;

export class CartService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(locale: string, input: CartCreateInput) {
    return this.executeTransaction(async (tx) => {
      const isGuestUser = !input.customerId;

      const productVariants = await tx.productVariant.findMany({
        where: {
          AND: [
            {
              productId: {
                in: input.items.map((item) => item.productId),
              },
            },
            {
              sku: {
                in: input.items.map((item) => item.sku),
              },
            },
          ],
        },
      });

      return await tx.cart.create({
        include: CART_INCLUDE,
        data: {
          totalAmount: CartService.calculateItemsTotalAmount(
            input.items,
            productVariants,
          ),
          anonymousId: isGuestUser
            ? (await this.createAnonymousCustomer(locale)).anonymousId
            : undefined,
          customer: {
            connect: {
              id: !isGuestUser ? input.customerId : undefined,
            },
          },
          items: {
            createMany: {
              data: input.items,
            },
          },
          store: { connect: { locale } },
        },
      });
    });
  }

  public async getById(locale: string, cartId: string) {
    return await this.prismaClient.cart.findUnique({
      where: { id: cartId, locale },
      include: CART_INCLUDE,
    });
  }

  public async update(locale: string, cartId: string, input: CartUpdateInput) {
    return this.executeTransaction(async (tx) => {
      const productVariants = await tx.productVariant.findMany({
        where: {
          AND: [
            {
              productId: {
                in: input.items.map((item) => item.productId),
              },
            },
            {
              sku: {
                in: input.items.map((item) => item.sku),
              },
            },
          ],
        },
      });

      const existingSkus = input.items
        .map((item) => item.sku)
        .filter((sku): sku is string => Boolean(sku));

      const itemsToUpdate = input.items.filter((item) => item.id);
      const itemsToCreate = input.items.filter((item) => !item.id);

      return await tx.cart.update({
        where: { id: cartId, locale },
        include: CART_INCLUDE,
        data: {
          totalAmount: CartService.calculateItemsTotalAmount(
            input.items,
            productVariants,
          ),
          items: {
            deleteMany: {
              cartId,
              sku: { notIn: existingSkus },
            },
            updateMany: itemsToUpdate.map((item) => ({
              where: { id: item.id },
              data: item,
            })),
            createMany: {
              data: itemsToCreate,
            },
          },
        },
      });
    });
  }

  public async delete(locale: string, cartId: string) {
    return await this.prismaClient.cart.delete({
      where: { id: cartId, locale },
      include: CART_INCLUDE,
    });
  }

  private async createAnonymousCustomer(locale: string) {
    const anonymousId = randomUUID();
    return await this.prismaClient.customer.create({
      data: {
        anonymousId,
        store: { connect: { locale } },
      },
      select: { anonymousId: true },
    });
  }

  private static calculateItemsTotalAmount(
    items: { sku: string; quantity: number }[],
    variants: ProductVariant[],
  ) {
    return variants
      .flatMap((variant) => {
        const item = items.find((item) => variant.sku === item.sku);

        if (!item) return [];

        return [{ quantity: item.quantity, ...variant }];
      })
      .reduce((acc, curr) => acc + curr.price.toNumber() * curr.quantity, 0);
  }
}
