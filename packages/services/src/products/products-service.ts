import { PrismaClient } from "@ecomm/db";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@ecomm/validations/products/product-schema";
import { generateSku } from "../utils/generate-sku";

export class ProductsService {
  constructor(private readonly prismaClient: PrismaClient) {}

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
              input.variants?.map((variant, index) => ({
                ...variant,
                sku: `${sku}-${(Date.now() + index).toString(36).slice(-6)}`,
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
    const product = await this.prismaClient.product.findUnique({
      where: { id: productId },
      select: { sku: true },
    });

    const sku = product?.sku;

    return await this.prismaClient.product.update({
      where: { id: productId },
      data: {
        features: input.features,
        name: input.name,
        description: input.description,
        variants: {
          deleteMany: {
            productId,
            sku: {
              notIn: input.variants
                .map((variant) => variant.sku)
                .filter((sku): sku is string => Boolean(sku)),
            },
          },
          updateMany: input.variants
            .filter((variant) => variant.sku)
            .map((variant) => ({
              where: { sku: variant.sku as string },
              data: variant,
            })),
          createMany: {
            data: input.variants
              .filter((variant) => !variant.sku)
              .map((variant, index) => ({
                ...variant,
                sku: `${sku}-${(Date.now() + index).toString(36).slice(-6)}`,
              })),
          },
        },
        category: input.categoryId
          ? {
              connect: { id: input.categoryId },
            }
          : {
              disconnect: {
                products: {
                  some: { id: productId },
                },
              },
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
