import type { PrismaClient } from '@ecomm/db';
import { BaseService } from '../base-service';
import type { Size } from '../products/product-dto';
import { OutOfStockError } from '../errors/out-of-stock-error';
import { NotFoundError } from '../errors/not-found-error';

export class StockService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async validateStockAndGetVariant(
    sku: string,
    size: string,
    quantity: number,
  ) {
    const variant = await this.prismaClient.productVariant.findUnique({
      where: { sku },
    });

    if (!variant) {
      throw new NotFoundError(
        `The product variant with the sku "${sku}" does not exist.`,
      );
    }

    const sizes = (variant.sizes ?? []) as unknown as Size[];
    const foundSize = sizes.find(({ value }) => value === size);

    if (foundSize && foundSize.stock - foundSize.reserved < quantity) {
      throw new OutOfStockError(sku);
    }

    return variant;
  }
}
