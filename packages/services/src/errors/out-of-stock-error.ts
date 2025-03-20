import { BaseError } from './base-error';

export class OutOfStockError extends BaseError {
  constructor(sku: string) {
    super(`Insufficient stock available for the sku "${sku}"`);

    this.name = 'OutOfStockError';
  }
}
