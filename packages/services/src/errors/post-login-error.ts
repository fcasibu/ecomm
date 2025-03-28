import { BaseError } from './base-error';

export class PostLoginError extends BaseError {
  constructor(message: string) {
    super(message);

    this.name = 'PostLoginError';
  }
}
