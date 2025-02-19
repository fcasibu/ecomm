import { PrismaClient } from "@ecomm/db";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@ecomm/validations/categories/category-schema";

export class CategoriesService {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(input: CategoryCreateInput) {
    return await this.prismaClient.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        image: input.image,
        description: input.description,
        parentId: input.parentId,
      },
    });
  }

  public async getById(categoryId: string) {
    return await this.prismaClient.category.findUnique({
      where: { id: categoryId },
    });
  }

  public async getBySlug(slug: string) {
    return await this.prismaClient.category.findUnique({
      where: { slug },
    });
  }

  public async getAll({
    page = 1,
    query,
    pageSize = 10,
  }: {
    query?: string;
    page?: number;
    pageSize?: number;
  }) {
    const [categories, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.category.findMany({
        skip: (page - 1) * pageSize,
        ...(query
          ? {
              where: {
                OR: [
                  {
                    name: { contains: query, mode: "insensitive" },
                  },
                  { slug: { contains: query, mode: "insensitive" } },
                ],
              },
            }
          : {}),
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      this.prismaClient.category.count({
        ...(query
          ? {
              where: {
                OR: [
                  {
                    name: { contains: query, mode: "insensitive" },
                  },
                  { slug: { contains: query, mode: "insensitive" } },
                ],
              },
            }
          : {}),
      }),
    ]);

    return { categories, totalCount };
  }

  public async update(categoryId: string, input: CategoryUpdateInput) {
    return await this.prismaClient.category.update({
      where: { id: categoryId },
      data: {
        ...(input.name ? { name: input.name } : null),
        ...(input.slug ? { slug: input.slug } : null),
        ...(input.description ? { description: input.description } : null),
        ...(input.image ? { image: input.image } : null),
        ...(input.parentId ? { parentId: input.parentId } : null),
      },
    });
  }

  public async delete(categoryId: string) {
    return this.prismaClient.category.delete({
      where: { id: categoryId },
    });
  }
}
