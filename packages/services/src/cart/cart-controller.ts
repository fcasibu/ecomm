import {
  cartCreateSchema,
  cartUpdateSchema,
  type CartCreateInput,
  type CartUpdateInput,
} from "@ecomm/validations/cms/cart/cart-schema";
import { BaseController } from "../base-controller";
import type { CartService } from "./cart-service";
import { logger } from "@ecomm/lib/logger";
import { ValidationError } from "../errors/validation-error";
import { NotFoundError } from "../errors/not-found-error";
import { CartTransformer } from "./cart-transformer";

export class CartController extends BaseController {
  private readonly transformer = new CartTransformer();

  constructor(private readonly cartService: CartService) {
    super();
  }

  public async create(locale: string, input: CartCreateInput) {
    try {
      logger.info({ input }, "Creating a new cart");
      const result = cartCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const cart = this.transformer.toDTO(
        await this.cartService.create(locale, result.data),
      );

      if (!cart) {
        throw new NotFoundError("Cart not found.");
      }

      logger.info({ cartId: cart.id }, "Cart successfully created");

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error creating cart",
      });
    }
  }

  public async update(locale: string, cartId: string, input: CartUpdateInput) {
    try {
      logger.info({ cartId, input }, "Updating cart");
      const result = cartUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedCart = this.transformer.toDTO(
        await this.cartService.update(locale, cartId, result.data),
      );
      if (!updatedCart) {
        throw new NotFoundError(`Cart ID "${cartId}" not found.`);
      }

      logger.info({ cartId: updatedCart.id }, "Fetched cart");

      return updatedCart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: `Error updating Cart`,
        notFoundMessage: `Error updating cart: Cart ID "${cartId}" not found.`,
      });
    }
  }

  public async delete(locale: string, cartId: string) {
    logger.info({ cartId }, "Deleting customer");

    try {
      await this.cartService.delete(locale, cartId);
      logger.info({ cartId }, "Cart deleted successfully");

      return { success: true };
    } catch (error) {
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting cart: Cart with the ID "${cartId}" was not found.`,
      });
    }
  }

  public async getById(locale: string, id: string) {
    try {
      logger.info({ id }, "Fetching cart");

      const cart = this.transformer.toDTO(
        await this.cartService.getById(locale, id),
      );

      if (!cart) {
        throw new NotFoundError(`Cart ID "${id}" not found.`);
      }

      logger.info({ cartId: cart.id }, "Fetched cart");

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error fetching cart",
      });
    }
  }
}
