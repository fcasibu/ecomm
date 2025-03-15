import { PrismaClient } from '@ecomm/db';
import type { Prisma } from '@ecomm/db';
import type {
  CategoryCreateInput,
  CategoryUpdateInput,
} from '@ecomm/validations/cms/categories/category-schema';
import type { SearchOptions } from '../base-service';
import { BaseService } from '../base-service';
import { MaxTierReachedError } from '../errors/max-tier-reached-error';
import { MaxCategoryChildrenCountError } from '../errors/max-children-count-error';
import { createTextSearchCondition } from '../utils/prisma-helpers';

export type Category = Prisma.CategoryGetPayload<{
  include: {
    children: true;
    products: {
      include: { variants: true };
    };
  };
}>;

const CATEGORY_INCLUDE = {
  children: true,
  products: {
    include: { variants: true },
  },
} as const satisfies Prisma.CategoryInclude;

export class CategoriesService extends BaseService {
  private readonly MAX_HIERARCHY = 3;
  private readonly MAX_CHILDREN_COUNT = 12;

  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(locale: string, input: CategoryCreateInput) {
    let tier = 1;
    if (input.parentId) {
      const metadata = await this.validateAndGetParentMetadata(
        locale,
        input.parentId,
      );
      tier = metadata.tier;
    }

    return await this.prismaClient.category.create({
      include: CATEGORY_INCLUDE,
      data: {
        name: input.name,
        slug: input.slug,
        image: input.image,
        description: input.description,
        tier,
        ...(input.parentId
          ? {
              parent: {
                connect: { id: input.parentId },
              },
            }
          : {}),
        store: {
          connect: { locale },
        },
      },
    });
  }

  public async getById(locale: string, categoryId: string) {
    return await this.prismaClient.category.findUnique({
      where: { id: categoryId, locale },
      include: CATEGORY_INCLUDE,
    });
  }

  public async getBySlug(locale: string, slug: string) {
    return await this.prismaClient.category.findUnique({
      where: { slug, locale },
      include: CATEGORY_INCLUDE,
    });
  }

  public async getAll(locale: string, options: SearchOptions) {
    const { query, page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    let whereCondition: Prisma.CategoryWhereInput = { locale };

    if (query) {
      whereCondition = createTextSearchCondition(query, ['name', 'slug']);
    }

    const [categories, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.category.findMany({
        include: CATEGORY_INCLUDE,
        where: whereCondition,
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
      this.prismaClient.category.count({ where: whereCondition }),
    ]);

    return this.formatPaginatedResponse(categories, totalCount, options);
  }

  public async getRootCategories(locale: string) {
    return await this.prismaClient.category.findMany({
      where: {
        parentId: null,
        locale,
      },
      include: CATEGORY_INCLUDE,
    });
  }

  public async update(
    locale: string,
    categoryId: string,
    input: CategoryUpdateInput,
  ) {
    return await this.prismaClient.category.update({
      where: { id: categoryId, locale },
      include: CATEGORY_INCLUDE,
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description,
        image: input.image,
      },
    });
  }

  public async delete(locale: string, categoryId: string) {
    return await this.prismaClient.category.delete({
      where: { id: categoryId, locale },
      include: CATEGORY_INCLUDE,
    });
  }

  public async getCategoriesPath(locale: string, categoryId: string) {
    const path: {
      id: string;
      name: string;
      slug: string;
    }[] = [];
    const fetchCategoryData = async (id: string) => {
      const category = await this.prismaClient.category.findUnique({
        where: { id, locale },
        select: {
          id: true,
          name: true,
          slug: true,
          parentId: true,
        },
      });

      if (!category) return;

      path.unshift({
        id: category.id,
        name: category.name,
        slug: category.slug,
      });

      if (category.parentId) {
        await fetchCategoryData(category.parentId);
      }
    };

    await fetchCategoryData(categoryId);
    return path;
  }

  private async validateAndGetParentMetadata(locale: string, parentId: string) {
    const parentData = await this.prismaClient.category.findUniqueOrThrow({
      where: { id: parentId, locale },
      select: {
        tier: true,
        _count: { select: { children: true } },
      },
    });

    const nextTier = (parentData.tier || 0) + 1;

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
