import {
  cartCreateSchema,
  type CartCreateInput,
} from '@ecomm/validations/cms/cart/cart-schema';
import { BaseController } from '../base-controller';
import type { CartService } from './cart-service';
import { logger } from '@ecomm/lib/logger';
import { ValidationError } from '../errors/validation-error';
import { NotFoundError } from '../errors/not-found-error';
import { CartTransformer } from './cart-transformer';
import type { AddToCartInput } from '@ecomm/validations/web/cart/add-to-cart-schema';
import type { ServerContext } from '@ecomm/lib/types';
import { UpdateItemQuantityError } from '../errors/update-item-quantity-error';
import type { UpdateDeliveryPromiseSelectionInput } from '@ecomm/validations/web/cart/update-delivery-promise-selection-schema';

export class CartController extends BaseController {
  private readonly transformer = new CartTransformer();

  constructor(private readonly cartService: CartService) {
    super();
  }

  public async create(locale: string, input: CartCreateInput) {
    try {
      logger.info({ input }, 'Creating a new cart');
      const result = cartCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const cart = this.transformer.toDTO(
        await this.cartService.create(locale, result.data),
      );

      if (!cart) {
        throw new NotFoundError('Cart not found.');
      }

      logger.info({ cartId: cart.id }, 'Cart successfully created');

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error creating cart',
      });
    }
  }

  public async delete(locale: string, cartId: string) {
    logger.info({ cartId }, 'Deleting customer');

    try {
      await this.cartService.delete(locale, cartId);
      logger.info({ cartId }, 'Cart deleted successfully');

      return { success: true };
    } catch (error) {
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting cart: Cart with the ID "${cartId}" was not found.`,
      });
    }
  }

  public async getById(locale: string, id: string) {
    try {
      logger.info({ id }, 'Fetching cart');

      const cart = this.transformer.toDTO(
        await this.cartService.getById(locale, id),
      );

      if (!cart) {
        throw new NotFoundError(`Cart ID "${id}" not found.`);
      }

      logger.info({ cartId: cart.id }, 'Fetched cart');

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching cart',
      });
    }
  }

  public async addToCart(context: ServerContext, input: AddToCartInput) {
    try {
      logger.info({ input }, 'Adding to cart');

      const cart = this.transformer.toDTO(
        await this.cartService.addToCart(context, input),
      );

      if (!cart) {
        throw new NotFoundError('There was an issue with finding the cart');
      }

      logger.info({ cartId: cart.id }, 'Add to cart successful');

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error add to cart',
      });
    }
  }

  public async findCart(context: ServerContext) {
    try {
      logger.info('Fetching cart');

      const cart = this.transformer.toDTO(
        await this.cartService.findCart(context),
      );

      if (!cart) {
        throw new NotFoundError('There was an issue with finding the cart');
      }

      logger.info({ cartId: cart.id }, 'Fetched cart successfully');

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error find cart',
      });
    }
  }

  public async updateItemQuantity(
    context: ServerContext,
    itemId: string,
    newQuantity: number,
  ) {
    try {
      logger.info({ itemId }, 'Updating item quantity');

      if (!context.cart.id) {
        throw new UpdateItemQuantityError();
      }

      const cart = this.transformer.toDTO(
        await this.cartService.updateItemQuantity(context, itemId, newQuantity),
      );

      if (!cart) {
        throw new NotFoundError('There was an issue with finding the cart');
      }

      logger.info({ cartId: cart.id }, 'Updated item quantity successfully');

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error updating item quantity',
      });
    }
  }

  public async updateItemDeliveryPromise(
    context: ServerContext,
    data: UpdateDeliveryPromiseSelectionInput,
  ) {
    try {
      logger.info({ data }, 'Updating item delivery promise');

      if (!context.cart.id) {
        throw new UpdateItemQuantityError();
      }

      const cart = this.transformer.toDTO(
        await this.cartService.updateItemDeliveryPromise(context, data),
      );

      if (!cart) {
        throw new NotFoundError('There was an issue with finding the cart');
      }

      logger.info(
        { cartId: cart.id },
        'Updated item delivery promise successfully',
      );

      return cart;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error updating item delivery promise',
      });
    }
  }
}
