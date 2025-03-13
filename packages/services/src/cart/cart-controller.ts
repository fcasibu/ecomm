import {
  cartCreateSchema,
  cartUpdateSchema,
  type CartCreateInput,
  type CartUpdateInput,
} from "@ecomm/validations/cart/cart-schema";
import { BaseController } from "../base-controller";
import type { Cart, CartService } from "./cart-service";
import { logger } from "@ecomm/lib/logger";
import { ValidationError } from "../errors/validation-error";
import { NotFoundError } from "../errors/not-found-error";
import type { CartDTO } from "./cart-dto";
import assert from "assert";

export class CartController extends BaseController {
  constructor(private readonly cartService: CartService) {
    super();
  }

  public async create(input: CartCreateInput) {
    try {
      logger.info({ input }, "Creating a new cart");
      const result = cartCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const cart = CartController.mapCart(
        await this.cartService.create(result.data),
      );

      if (!cart) {
        throw new NotFoundError("Cart not found.");
      }

      logger.info({ cart }, "Cart successfully created");

      return cart;
    } catch (error) {
      this.mapError(error, {
        message: "Error creating cart",
      });
    }
  }

  public async update(cartId: string, input: CartUpdateInput) {
    try {
      logger.info({ cartId, input }, "Updating cart");
      const result = cartUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedCart = CartController.mapCart(
        await this.cartService.update(cartId, result.data),
      );
      logger.info({ updatedCart }, "Cart updated successfully");
      return updatedCart;
    } catch (error) {
      this.mapError(error, {
        message: `Error updating Cart`,
        notFoundMessage: `Error updating cart: Cart ID "${cartId}" not found.`,
      });
    }
  }

  public async delete(cartId: string) {
    logger.info({ cartId }, "Deleting customer");

    try {
      await this.cartService.delete(cartId);
      logger.info({ cartId }, "Cart deleted successfully");

      return { success: true };
    } catch (error) {
      this.mapError(error, {
        notFoundMessage: `Error deleting cart: Cart with the ID "${cartId}" was not found.`,
      });
    }
  }

  public async getById(id: string) {
    try {
      logger.info({ id }, "Fetching cart");

      const cart = CartController.mapCart(await this.cartService.getById(id));

      if (!cart) {
        throw new NotFoundError(`Cart ID "${id}" not found.`);
      }

      logger.info({ cart }, "Fetched cart");

      return cart;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching cart",
      });
    }
  }

  private static mapCart(
    cart: Cart | null | undefined,
  ): CartDTO | null | undefined {
    if (!cart) return cart;

    const getVariant = (
      product: Cart["items"][number]["product"],
      sku: string,
    ) => {
      return product.variants.find((variant) => variant.sku === sku);
    };

    return {
      ...cart,
      updatedAt: cart.updatedAt.toLocaleDateString(),
      createdAt: cart.createdAt.toLocaleDateString(),
      totalAmount: cart.totalAmount.toNumber(),
      items: cart.items.map((item) => {
        const variant = getVariant(item.product, item.sku);

        assert(variant, "variant should always be defined");

        return {
          id: item.id,
          sku: item.sku,
          quantity: item.quantity,
          price: variant.price.toNumber(),
          stock: variant.stock,
          currencyCode: variant.currencyCode,
          image: variant.image,
          name: item.product.name,
          updatedAt: item.updatedAt.toLocaleDateString(),
          createdAt: item.createdAt.toLocaleDateString(),
        };
      }),
    };
  }
}
