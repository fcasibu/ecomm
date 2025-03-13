import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateInput,
  type ProductUpdateInput,
} from "@ecomm/validations/products/product-schema";
import type { Product, ProductsService } from "./products-service";
import { ValidationError } from "../errors/validation-error";
import { BaseController } from "../base-controller";
import { logger } from "@ecomm/lib/logger";
import type { ProductDTO, ProductVariantDTO } from "./product-dto";
import { NotFoundError } from "../errors/not-found-error";

export class ProductsController extends BaseController {
  constructor(private readonly productsService: ProductsService) {
    super();
  }

  public async create(input: ProductCreateInput) {
    try {
      logger.info({ input }, "Creating a new product");
      const result = productCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const product = ProductsController.mapProduct(
        await this.productsService.create(result.data),
      );

      if (!product) {
        throw new NotFoundError("Product not found.");
      }

      logger.info({ product }, "Product successfully created");

      return product;
    } catch (error) {
      this.mapError(error, {
        message: "Error creating product",
      });
    }
  }

  public async update(productId: string, input: ProductUpdateInput) {
    try {
      logger.info({ productId, input }, "Updating product");
      const result = productUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedProduct = ProductsController.mapProduct(
        await this.productsService.update(productId, result.data),
      );
      logger.info({ updatedProduct }, "Product updated successfully");
      return updatedProduct;
    } catch (error) {
      this.mapError(error, {
        message: `Error updating product`,
        notFoundMessage: `Error updating product: Product ID "${productId}" not found.`,
      });
    }
  }

  public async delete(productId: string) {
    logger.info({ productId }, "Deleting product");

    try {
      await this.productsService.delete(productId);
      logger.info({ productId }, "Product deleted successfully");

      return { success: true };
    } catch (error) {
      this.mapError(error, {
        notFoundMessage: `Error deleting product: Product with the ID "${productId}" was not found.`,
      });
    }
  }

  public async getById(id: string) {
    try {
      logger.info({ id }, "Fetching product");

      const product = ProductsController.mapProduct(
        await this.productsService.getById(id),
      );

      if (!product) {
        throw new NotFoundError(`Product ID "${id}" not found.`);
      }

      logger.info({ product }, "Fetched product");

      return product;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching product",
      });
    }
  }

  public async getAll(input: {
    page?: number;
    query?: string;
    pageSize?: number;
  }) {
    logger.info({ input }, "Fetching all products");

    try {
      const result = await this.productsService.getAll(input);

      const transformedProducts = result.items
        .map(ProductsController.mapProduct)
        .filter((product): product is ProductDTO => Boolean(product));

      const response = {
        products: transformedProducts,
        totalCount: result.totalCount,
        pageCount: result.pageCount,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      };

      logger.info({ response }, "Products fetched successfully");

      return response;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all products",
      });
    }
  }

  private static mapProduct(
    product: Product | null | undefined,
  ): ProductDTO | null | undefined {
    if (!product) return product;

    return {
      ...product,
      createdAt: product.createdAt.toLocaleDateString(),
      updatedAt: product.updatedAt.toLocaleDateString(),
      variants: product.variants.map((variant) => ({
        ...variant,
        createdAt: variant.createdAt.toLocaleDateString(),
        updatedAt: variant.updatedAt.toLocaleDateString(),
        price: variant.price.toNumber(),
        attributes:
          variant.attributes?.valueOf() as ProductVariantDTO["attributes"],
      })),
      ...(product.category
        ? {
            category: {
              ...product.category,
              createdAt: product.category.createdAt.toLocaleDateString(),
              updatedAt: product.category.updatedAt.toLocaleDateString(),
            },
          }
        : { category: null }),
    };
  }
}
