import { PrismaClient } from "@ecomm/db";
import type { Prisma } from "@ecomm/db";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@ecomm/validations/products/product-schema";
import type { SearchOptions } from "../base-service";
import { BaseService } from "../base-service";
import { generateSku, generateVariantSku } from "../utils/generate-sku";
import {
  createTextSearchCondition,
  createNestedTextSearchCondition,
  combineSearchConditions,
} from "../utils/prisma-helpers";

export type Product = Prisma.ProductGetPayload<{
  include: {
    category: true;
    variants: true;
  };
}>;

const PRODUCT_INCLUDE = {
  category: true,
  variants: true,
} as const satisfies Prisma.ProductInclude;

export class ProductsService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(input: ProductCreateInput) {
    const sku = generateSku(input.name);

    return await this.prismaClient.product.create({
      data: {
        sku,
        features: input.features,
        name: input.name,
        description: input.description,
        variants: {
          createMany: {
            data:
              input.variants?.map((variant) => ({
                ...variant,
                sku: generateVariantSku(sku),
              })) ?? [],
          },
        },
        ...(input.categoryId
          ? { category: { connect: { id: input.categoryId } } }
          : {}),
      },
      include: PRODUCT_INCLUDE,
    });
  }

  public async getById(productId: string) {
    return await this.prismaClient.product.findUnique({
      where: { id: productId },
      include: PRODUCT_INCLUDE,
    });
  }

  public async getAll(options: SearchOptions) {
    const { query, page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    let whereCondition = {};

    if (query) {
      const directSearch = createTextSearchCondition(query, ["name", "sku"]);
      const nestedSearch = createNestedTextSearchCondition(query, [
        { model: "variants", field: "sku" },
      ]);

      whereCondition = combineSearchConditions(directSearch, nestedSearch);
    }

    const [products, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.product.findMany({
        include: PRODUCT_INCLUDE,
        where: whereCondition,
        orderBy: { updatedAt: "desc" },
        ...pagination,
      }),
      this.prismaClient.product.count({ where: whereCondition }),
    ]);

    return this.formatPaginatedResponse(products, totalCount, options);
  }

  public async update(productId: string, input: ProductUpdateInput) {
    const product = await this.prismaClient.product.findUniqueOrThrow({
      where: { id: productId },
      select: { sku: true },
    });

    return await this.executeTransaction(async () => {
      const existingVariantSkus = input.variants
        .map((variant) => variant.sku)
        .filter((sku): sku is string => Boolean(sku));

      const variantsToUpdate = input.variants.filter((variant) => variant.sku);
      const variantsToCreate = input.variants.filter((variant) => !variant.sku);

      return await this.prismaClient.product.update({
        where: { id: productId },
        data: {
          features: input.features,
          name: input.name,
          description: input.description,
          variants: {
            deleteMany: {
              productId,
              sku: { notIn: existingVariantSkus },
            },
            updateMany: variantsToUpdate.map((variant) => ({
              where: { sku: variant.sku as string },
              data: variant,
            })),
            createMany: {
              data: variantsToCreate.map((variant) => ({
                ...variant,
                sku: generateVariantSku(product.sku),
              })),
            },
          },
          category: input.categoryId
            ? { connect: { id: input.categoryId } }
            : { disconnect: true },
        },
        include: PRODUCT_INCLUDE,
      });
    });
  }

  public async delete(productId: string) {
    return await this.prismaClient.product.delete({
      where: { id: productId },
      include: PRODUCT_INCLUDE,
    });
  }
}
