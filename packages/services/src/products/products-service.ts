import { PrismaClient } from "@ecomm/db";
import type {
  ProductCreateInput,
  ProductUpdateInput,
} from "@ecomm/validations/products/product-schema";

// TODO(fcasibu): Create CRUD

export class ProductsService {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(input: ProductCreateInput) {
    return await this.prismaClient.product.create({
      data: {
        sku: input.sku,
        features: input.features,
        name: input.name,
        price: input.price,
        stock: input.stock,
        images: input.images,
        description: input.description,
        currencyCode: input.currencyCode,
        category: {
          connect: { id: input.categoryId },
        },
      },
    });
  }

  public async getById(productId: string) {
    return await this.prismaClient.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
      },
    });
  }

  public async getAll({
    page = 1,
    pageSize = 10,
    categoryId,
  }: {
    page?: number;
    pageSize?: number;
    categoryId?: string;
  }) {
    return await this.prismaClient.product.findMany({
      where: categoryId ? { categoryId } : {},
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { name: "asc" },
      include: {
        category: true,
      },
    });
  }

  public async update(productId: string, input: Partial<ProductUpdateInput>) {
    return await this.prismaClient.product.update({
      where: { id: productId },
      data: {
        name: input.name,
        features: input.features,
        description: input.description,
        price: input.price,
        stock: input.stock,
        images: input.images,
        category: {
          update: { id: input.categoryId },
        },
      },
    });
  }

  public async delete(productId: string) {
    return await this.prismaClient.product.delete({
      where: { id: productId },
    });
  }
}
