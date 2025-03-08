import { PrismaClient } from "@ecomm/db";
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from "@ecomm/validations/categories/category-schema";
import { MaxTierReachedError } from "../errors/max-tier-reached-error";
import { MaxCategoryChildrenCountError } from "../errors/max-children-count-error";

export class CategoriesService {
  constructor(private readonly prismaClient: PrismaClient) {}

  private readonly MAX_HIERARCHY = 3;
  private readonly MAX_CHILDREN_COUNT = 12;

  public async create(input: CategoryCreateInput) {
    let tier = 1;
    if (input.parentId) {
      const metadata = await this.validateAndGetParentMetadata(input.parentId);

      if (metadata) {
        tier = metadata.tier;
      }
    }

    return await this.prismaClient.category.create({
      include: {
        children: true,
        products: true,
      },
      data: {
        name: input.name,
        slug: input.slug,
        image: input.image,
        description: input.description,
        parentId: input.parentId,
        tier,
      },
    });
  }

  public async getById(categoryId: string) {
    return await this.prismaClient.category.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
        products: true,
      },
    });
  }

  public async getBySlug(slug: string) {
    return await this.prismaClient.category.findUnique({
      where: { slug },
      include: {
        children: true,
        products: true,
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
    const [categories, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.category.findMany({
        include: {
          children: true,
          products: true,
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
                  { slug: { contains: query, mode: "insensitive" } },
                ],
              },
            }
          : {}),
        orderBy: {
          updatedAt: "desc",
        },
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

  public async getRootCategories() {
    const rootCategories = await this.prismaClient.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        children: true,
        products: true,
      },
    });

    return rootCategories;
  }

  public async update(categoryId: string, input: CategoryUpdateInput) {
    return await this.prismaClient.category.update({
      where: { id: categoryId },
      include: {
        children: true,
        products: true,
      },
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        image: input.image,
      },
    });
  }

  public async delete(categoryId: string) {
    return this.prismaClient.category.delete({
      where: { id: categoryId },
    });
  }

  public async getCategoriesPath(categoryId: string) {
    const path: { id: string; name: string; slug: string }[] = [];

    let currentCategory = await this.prismaClient.category.findUnique({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        slug: true,
        parentId: true,
      },
    });

    while (currentCategory) {
      path.unshift({
        id: currentCategory.id,
        name: currentCategory.name,
        slug: currentCategory.slug,
      });

      if (!currentCategory.parentId) break;

      currentCategory = await this.prismaClient.category.findUnique({
        where: { id: currentCategory.parentId },
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
        },
      });
    }

    return path;
  }

  private async validateAndGetParentMetadata(parentId: string) {
    const parentData = await this.prismaClient.category.findUnique({
      where: { id: parentId },
      select: {
        tier: true,
        _count: { select: { children: true } },
      },
    });

    if (!parentData) return { tier: 1 };

    const nextTier = parentData.tier + 1;

    if (nextTier > this.MAX_HIERARCHY) {
      throw new MaxTierReachedError(this.MAX_HIERARCHY);
    }

    if (parentData._count.children >= this.MAX_CHILDREN_COUNT) {
      throw new MaxCategoryChildrenCountError();
    }

    return {
      tier: nextTier,
    };
  }
}
