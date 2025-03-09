import { PrismaClient } from "@ecomm/db";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@ecomm/validations/products/product-schema";
import { generateSku } from "../utils/generate-sku";

export class ProductsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(input: ProductCreateInput) {
    return await this.prismaClient.product.create({
      data: {
        features: input.features,
        name: input.name,
        description: input.description,
        variants: {
          createMany: {
            data:
              input.variants?.map((variant) => ({
                ...variant,
                sku: generateSku(input.name!),
              })) ?? [],
          },
        },
        ...(input.categoryId
          ? {
              category: {
                connect: { id: input.categoryId },
              },
            }
          : {}),
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  public async getById(productId: string) {
    return await this.prismaClient.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  public async getAll({
    page,
    query,
    pageSize,
  }: {
    query?: string;
    page?: number;
    pageSize?: number;
  }) {
    const [products, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.product.findMany({
        include: {
          variants: true,
          category: true,
        },
        ...(page && pageSize
          ? { skip: (page - 1) * pageSize, take: pageSize }
          : {}),
        ...(query
          ? {
              where: {
                OR: [
                  {
                    name: { contains: query, mode: "insensitive" },
                  },
                  {
                    variants: {
                      some: { sku: { contains: query, mode: "insensitive" } },
                    },
                  },
                ],
              },
            }
          : {}),
        orderBy: {
          updatedAt: "desc",
        },
      }),
      this.prismaClient.product.count({
        ...(query
          ? {
              where: {
                OR: [
                  {
                    name: { contains: query, mode: "insensitive" },
                  },
                  {
                    variants: {
                      some: { sku: { contains: query, mode: "insensitive" } },
                    },
                  },
                ],
              },
            }
          : {}),
      }),
    ]);

    return { products, totalCount };
  }

  public async update(productId: string, input: ProductUpdateInput) {
    return await this.prismaClient.product.update({
      where: { id: productId },
      data: {
        features: input.features,
        name: input.name,
        description: input.description,
        ...(input.variants.length
          ? {
              variants: {
                updateMany: {
                  data: input.variants,
                  where: {
                    productId,
                  },
                },
              },
            }
          : {}),
        category: {
          update: { id: input.categoryId },
        },
      },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  public async delete(productId: string) {
    return await this.prismaClient.product.delete({
      where: { id: productId },
    });
  }
}
