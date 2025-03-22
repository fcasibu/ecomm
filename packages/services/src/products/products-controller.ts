import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateInput,
  type ProductUpdateInput,
} from '@ecomm/validations/cms/products/product-schema';
import type { ProductsService } from './products-service';
import { ValidationError } from '../errors/validation-error';
import { BaseController } from '../base-controller';
import { logger } from '@ecomm/lib/logger';
import type { ProductDTO } from './product-dto';
import { NotFoundError } from '../errors/not-found-error';
import { ProductTransformer } from './product-transformer';

export class ProductsController extends BaseController {
  private readonly transformer = new ProductTransformer();

  constructor(private readonly productsService: ProductsService) {
    super();
  }

  public async create(locale: string, input: ProductCreateInput) {
    try {
      logger.info({ input }, 'Creating a new product');
      const result = productCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const product = this.transformer.toDTO(
        await this.productsService.create(locale, result.data),
      );

      if (!product) {
        throw new NotFoundError('Product not found.');
      }

      logger.info({ productId: product.id }, 'Product successfully created');

      return product;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error creating product',
      });
    }
  }

  public async update(
    locale: string,
    productId: string,
    input: ProductUpdateInput,
  ) {
    try {
      logger.info({ productId, input }, 'Updating product');
      const result = productUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedProduct = this.transformer.toDTO(
        await this.productsService.update(locale, productId, result.data),
      );

      if (!updatedProduct) {
        throw new NotFoundError('Product not found.');
      }

      logger.info(
        { productId: updatedProduct.id },
        'Product updated successfully',
      );
      return updatedProduct;
    } catch (error) {
      this.logAndThrowError(error, {
        message: `Error updating product`,
        notFoundMessage: `Error updating product: Product ID "${productId}" not found.`,
      });
    }
  }

  public async delete(locale: string, productId: string) {
    logger.info({ productId }, 'Deleting product');

    try {
      await this.productsService.delete(locale, productId);
      logger.info({ productId }, 'Product deleted successfully');

      return { success: true };
    } catch (error) {
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting product: Product with the ID "${productId}" was not found.`,
      });
    }
  }

  public async getById(locale: string, id: string) {
    try {
      logger.info({ id }, 'Fetching product');

      const product = this.transformer.toDTO(
        await this.productsService.getById(locale, id),
      );

      if (!product) {
        throw new NotFoundError(`Product ID "${id}" not found.`);
      }

      logger.info({ productId: product.id }, 'Fetched product');

      return product;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching product',
      });
    }
  }

  public async getBySku(locale: string, sku: string) {
    try {
      logger.info({ sku }, 'Fetching product');

      const product = this.transformer.toDTO(
        await this.productsService.getBySku(locale, sku),
      );

      if (!product) {
        throw new NotFoundError(`Product SKU "${sku}" not found.`);
      }

      logger.info({ sku: product.sku }, 'Fetched product');

      return product;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching product',
      });
    }
  }

  public async getAll(
    locale: string,
    input: {
      page?: number;
      query?: string;
      pageSize?: number;
    },
  ) {
    logger.info({ input }, 'Fetching all products');

    try {
      const result = await this.productsService.getAll(locale, input);

      const transformedProducts = result.items
        .map((item) => this.transformer.toDTO(item))
        .filter((product): product is ProductDTO => Boolean(product));

      const response = {
        products: transformedProducts,
        totalCount: result.totalCount,
        pageCount: result.pageCount,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      };

      logger.info(
        {
          totalCount: response.totalCount,
          pageCount: response.pageCount,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        },
        'Products fetched successfully',
      );

      return response;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching all products',
      });
    }
  }

  public async getProductsBySkus(locale: string, skus: string[]) {
    logger.info({ skus }, 'Fetching products by skus');

    try {
      const result = await this.productsService.getAllBySkus(locale, skus);

      const transformedProducts = result
        .map((item) => this.transformer.toDTO(item))
        .filter((product): product is ProductDTO => Boolean(product));

      logger.info('Products by skus fetched successfully');

      return transformedProducts;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching all products',
      });
    }
  }
}
