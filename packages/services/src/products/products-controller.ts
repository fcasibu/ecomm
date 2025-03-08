import {
  productCreateSchema,
  type ProductCreateInput,
} from "@ecomm/validations/products/product-schema";
import type { ProductsService } from "./products-service";
import { ValidationError } from "../errors/validation-error";
import { BaseController } from "../base-controller";
import type { Prisma } from "@ecomm/db";
import { logger } from "@ecomm/lib/logger";
import type { ProductDTO } from "./product-dto";
import { NotFoundError } from "../errors/not-found-error";

type Product = Prisma.ProductGetPayload<{
  include: {
    category: true;
    variants: true;
  };
}>;

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
      const { products, totalCount } = await this.productsService.getAll(input);

      const transformedProducts = products
        .map(ProductsController.mapProduct)
        .filter((product): product is ProductDTO => Boolean(product));

      logger.info(
        { products: transformedProducts, totalCount },
        "Products fetched successfully",
      );
      return { products: transformedProducts, totalCount };
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
