import { BaseError } from './base-error';

export class UpdateItemQuantityError extends BaseError {
  constructor() {
    super('Cart was not found for updating the item quantity');

    this.name = 'UpdateItemQuantityError';
  }
}
