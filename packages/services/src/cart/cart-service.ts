import { PrismaClient } from "@ecomm/db";
import type { Prisma, ProductVariant } from "@ecomm/db";
import type {
  CartCreateInput,
  CartUpdateInput,
} from "@ecomm/validations/cart/cart-schema";
import { BaseService } from "../base-service";
import { randomUUID } from "node:crypto";

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

  public async create(input: CartCreateInput) {
    return this.executeTransaction(async () => {
      const isGuestUser = !input.customerId;

      const productVariants = await this.prismaClient.productVariant.findMany({
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

      return await this.prismaClient.cart.create({
        include: CART_INCLUDE,
        data: {
          totalAmount: CartService.calculateItemsTotalAmount(
            input.items,
            productVariants,
          ),
          anonymousId: isGuestUser
            ? (await this.createAnonymousCustomer()).anonymousId
            : undefined,
          customerId: !isGuestUser ? input.customerId : undefined,
          items: {
            createMany: {
              data: input.items,
            },
          },
        },
      });
    });
  }

  public async getById(cartId: string) {
    return await this.prismaClient.cart.findUnique({
      where: { id: cartId },
      include: CART_INCLUDE,
    });
  }

  public async update(cartId: string, input: CartUpdateInput) {
    return this.executeTransaction(async () => {
      const productVariants = await this.prismaClient.productVariant.findMany({
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

      return await this.prismaClient.cart.update({
        where: { id: cartId },
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

  public async delete(cartId: string) {
    return await this.prismaClient.cart.delete({
      where: { id: cartId },
      include: CART_INCLUDE,
    });
  }

  private async createAnonymousCustomer() {
    const anonymousId = randomUUID();
    return await this.prismaClient.customer.create({
      data: {
        anonymousId,
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
