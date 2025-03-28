import { PrismaClient } from '@ecomm/db';
import type { Prisma } from '@ecomm/db';
import type { CartCreateInput } from '@ecomm/validations/cms/cart/cart-schema';
import { BaseService } from '../base-service';
import { randomUUID } from 'node:crypto';
import type { AddToCartInput } from '@ecomm/validations/web/cart/add-to-cart-schema';
import { CartArgsFactory } from '../strategies/cart-args-strategy';
import type { ServerContext } from '@ecomm/lib/types';
import type { StockService } from '../stock/stock-service';
import type { UpdateDeliveryPromiseSelectionInput } from '@ecomm/validations/web/cart/update-delivery-promise-selection-schema';
import assert from 'node:assert';

export type UserType = 'customer' | 'guest' | 'new';

export type Cart = Prisma.CartGetPayload<{
  include: { items: { include: { deliveryPromises: true } } };
}>;

const CART_INCLUDE = {
  items: {
    include: {
      deliveryPromises: true,
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
      let anonymousId: string | undefined = undefined;

      if (isGuestUser) {
        anonymousId =
          (await this.createAnonymousCustomer(locale)).anonymousId ?? undefined;
      }

      return await tx.cart.create({
        include: CART_INCLUDE,
        data: {
          anonymousId: anonymousId,
          ...(input.customerId && {
            customer: {
              connect: {
                id: input.customerId,
              },
            },
          }),
          store: { connect: { locale } },
          items: {
            create: input.items.map((item) => ({
              name: item.name,
              sku: item.sku,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              deliveryPromises: {
                create: item.deliveryPromises.map((dp, index) => ({
                  price: dp.price,
                  shippingMethod: dp.shippingMethod,
                  estimatedMinDays: dp.estimatedMinDays,
                  estimatedMaxDays: dp.estimatedMaxDays,
                  enabled: index === 0,
                  requiresShippingFee: dp.requiresShippingFee,
                })),
              },
            })),
          },
        },
      });
    });
  }

  public async getById(locale: string, cartId: string) {
    return await this.prismaClient.cart.findUnique({
      include: CART_INCLUDE,
      where: { id: cartId, locale },
    });
  }

  public async delete(locale: string, cartId: string) {
    return await this.prismaClient.cart.delete({
      where: { id: cartId, locale },
    });
  }

  public async addToCart(context: ServerContext, input: AddToCartInput) {
    const { sku, quantity, size } = input;

    return await this.executeTransaction(async (tx) => {
      await this.stockService.validateStockAndGetVariant(sku, size, quantity);

      const cart = await this.findCart(context);

      return await this.addItemToCart(tx, cart, context, input);
    });
  }

  private async addItemToCart(
    tx: Prisma.TransactionClient,
    cart: Cart | null,
    context: ServerContext,
    item: AddToCartInput,
  ) {
    let currentCart: Cart | null = cart;
    if (!cart) {
      currentCart = await this.createCartIfNotExists(tx, context);
    }

    return this.updateCartWithNewItem(tx, currentCart, item);
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
      data: { store: { connect: { locale } }, ...args },
    });
  }

  private async updateCartWithNewItem(
    tx: Prisma.TransactionClient,
    cart: Cart | null,
    item: AddToCartInput,
  ) {
    if (!cart) {
      throw new Error('There was an issue with updating the new cart item');
    }

    const hasSelectedDeliveryPromise = item.deliveryPromises.some(
      (dp) => dp.selected,
    );

    return tx.cart.update({
      include: CART_INCLUDE,
      data: {
        items: {
          upsert: {
            where: {
              cartId_sku_size_color_name: {
                cartId: cart.id,
                sku: item.sku,
                size: item.size,
                color: item.color,
                name: item.name,
              },
            },
            update: { quantity: { increment: item.quantity } },
            create: {
              name: item.name,
              sku: item.sku,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              image: item.image,
              price: item.price,
              deliveryPromises: {
                create: item.deliveryPromises.map((dp, index) => ({
                  price: dp.price,
                  shippingMethod: dp.shippingMethod,
                  estimatedMinDays: dp.estimatedMinDays,
                  estimatedMaxDays: dp.estimatedMaxDays,
                  selected: hasSelectedDeliveryPromise
                    ? dp.selected
                    : index === 0,
                  requiresShippingFee: dp.requiresShippingFee,
                })),
              },
            },
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

  public async updateItemDeliveryPromise(
    context: ServerContext,
    data: UpdateDeliveryPromiseSelectionInput,
  ) {
    const { locale, cart } = context;
    const selectedPromiseId = data.deliveryPromiseId;

    return await this.prismaClient.cart.update({
      include: CART_INCLUDE,
      where: {
        id: cart.id as string,
        locale,
      },
      data: {
        items: {
          update: {
            where: {
              id: data.itemId,
            },
            data: {
              deliveryPromises: {
                updateMany: [
                  {
                    where: { id: selectedPromiseId },
                    data: { selected: true },
                  },
                  {
                    where: {
                      id: { not: selectedPromiseId },
                    },
                    data: { selected: false },
                  },
                ],
              },
            },
          },
        },
      },
    });
  }

  // TODO(fcasibu): Only for new user, not for existing user
  public async postLogin(context: ServerContext) {
    const { locale, user, cart } = context;

    assert(user.customerId, 'User must be logged in');
    assert(user.anonymousId, 'Should contain anonymousId');
    assert(cart.id, 'Cart must exist');

    return this.prismaClient.cart.update({
      include: CART_INCLUDE,
      where: {
        locale,
        anonymousId: user.anonymousId,
        id: cart.id,
      },
      data: {
        anonymousId: {
          set: null,
        },
        customer: {
          connect: {
            id: user.customerId,
          },
        },
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
}
