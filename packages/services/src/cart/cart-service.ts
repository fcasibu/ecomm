import { PrismaClient } from '@ecomm/db';
import type { Prisma, ProductVariant } from '@ecomm/db';
import type {
  CartCreateInput,
  CartUpdateInput,
} from '@ecomm/validations/cms/cart/cart-schema';
import { BaseService } from '../base-service';
import { randomUUID } from 'node:crypto';
import type { AddToCartInput } from '@ecomm/validations/web/cart/add-to-cart-schema';
import { CartArgsFactory } from '../strategies/cart-args-strategy';
import type { ServerContext } from '@ecomm/lib/types';
import type { StockService } from '../stock/stock-service';

export type UserType = 'customer' | 'guest' | 'new';

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
  constructor(
    prismaClient: PrismaClient,
    private readonly stockService: StockService,
  ) {
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

  public async addToCart(context: ServerContext, input: AddToCartInput) {
    const { sku, quantity, size } = input;

    return await this.executeTransaction(async (tx) => {
      const productVariant = await this.stockService.validateStockAndGetVariant(
        sku,
        size,
        quantity,
      );

      const cart = await this.findCart(context);

      return await this.addItemToCart(tx, cart, context, input, productVariant);
    });
  }

  private async addItemToCart(
    tx: Prisma.TransactionClient,
    cart: Cart | null,
    context: ServerContext,
    item: AddToCartInput,
    productVariant: ProductVariant,
  ) {
    let currentCart: Cart | null = cart;
    if (!cart) {
      currentCart = await this.createCartIfNotExists(tx, context);
    }

    return this.updateCartWithNewItem(tx, currentCart, item, productVariant);
  }

  private async createCartIfNotExists(
    tx: Prisma.TransactionClient,
    context: ServerContext,
  ) {
    const { user, locale } = context;
    const userType = CartService.determineUserType(
      user.customerId,
      user.anonymousId,
    );
    const args = CartArgsFactory.create({
      anonymousId: user.anonymousId,
      customerId: user.customerId,
      locale,
      userType,
    });

    return tx.cart.create({
      include: CART_INCLUDE,
      data: { totalAmount: 0, store: { connect: { locale } }, ...args },
    });
  }

  private async updateCartWithNewItem(
    tx: Prisma.TransactionClient,
    cart: Cart | null,
    item: AddToCartInput,
    productVariant: ProductVariant,
  ) {
    if (!cart) {
      throw new Error('There was an issue with updating the new cart item');
    }

    return tx.cart.update({
      include: CART_INCLUDE,
      data: {
        totalAmount: CartService.calculateItemsTotalAmount(
          [...cart.items, item],
          [productVariant],
        ),
        items: {
          upsert: {
            where: {
              cartId_sku_size: {
                cartId: cart.id,
                sku: item.sku,
                size: item.size,
              },
            },
            update: { quantity: { increment: item.quantity } },
            create: item,
          },
        },
      },
      where: { id: cart.id },
    });
  }

  public async findCart(context: ServerContext) {
    const { cart: cartContext, user, locale } = context;
    const userType = CartService.determineUserType(
      user.customerId,
      user.anonymousId,
    );

    let cart: Cart | null = null;

    if (cartContext.id) {
      cart = await this.prismaClient.cart.findUnique({
        include: CART_INCLUDE,
        where: { id: cartContext.id, locale: locale },
      });
    } else if (userType === 'customer' || userType === 'guest') {
      const filterField =
        userType === 'customer' ? 'customerId' : 'anonymousId';
      const filterValue =
        userType === 'customer' ? user.customerId : user.anonymousId;

      cart = await this.prismaClient.cart.findFirst({
        include: CART_INCLUDE,
        where: { locale: context.locale, [filterField]: filterValue },
      });
    }

    return cart;
  }

  public async updateItemQuantity(
    context: ServerContext,
    itemId: string,
    newQuantity: number,
  ) {
    const { locale, cart } = context;
    const quantity = newQuantity < 0 ? 0 : newQuantity;

    const itemsOperation =
      quantity > 0
        ? {
            update: {
              where: {
                id: itemId,
              },
              data: {
                quantity: newQuantity,
              },
            },
          }
        : {
            delete: {
              id: itemId,
            },
          };

    return await this.prismaClient.cart.update({
      include: CART_INCLUDE,
      where: {
        locale,
        id: cart.id as string,
      },
      data: {
        items: itemsOperation,
      },
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

  private static determineUserType(
    customerId: string | null | undefined,
    anonymousId: string | null | undefined,
  ): UserType {
    if (customerId) return 'customer';
    if (anonymousId) return 'guest';
    return 'new';
  }

  private static calculateItemsTotalAmount(
    items: { sku: string; quantity: number }[],
    variants: ProductVariant[],
  ) {
    return items
      .flatMap((item) => {
        const productVariant = variants.find(
          (variant) => variant.sku === item.sku,
        );

        if (!productVariant) return [];

        return [{ ...item, price: productVariant.price }];
      })

      .reduce((acc, curr) => acc + curr.price.toNumber() * curr.quantity, 0);
  }
}
