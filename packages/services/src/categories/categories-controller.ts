import type { CategoriesService } from "./categories-service";
import { ValidationError } from "../errors/validation-error";
import {
  type CategoryCreateInput,
  categoryCreateSchema,
  type CategoryUpdateInput,
  categoryUpdateSchema,
} from "@ecomm/validations/categories/category-schema";
import { NotFoundError } from "../errors/not-found-error";
import { logger } from "@ecomm/lib/logger";
import type { Prisma } from "@ecomm/db";
import type { CategoryDTO } from "./category-dto";
import { BaseController } from "../base-controller";

type Category = Prisma.CategoryGetPayload<{
  include: {
    children: true;
    products: true;
  };
}>;

export class CategoriesController extends BaseController {
  constructor(private readonly categoriesService: CategoriesService) {
    super();
  }

  public async create(input: CategoryCreateInput) {
    try {
      logger.info({ input }, "Creating a new category");
      const result = categoryCreateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const category = CategoriesController.mapCategory(
        await this.categoriesService.create(result.data),
      );
      logger.info({ category }, "Category created successfully");
      return category;
    } catch (error) {
      this.mapError(error, {
        message: `Error creating category`,
        duplicateMessage: `Error creating category: Category slug "${input.slug}" already exists.`,
      });
    }
  }

  public async update(categoryId: string, input: CategoryUpdateInput) {
    try {
      logger.info({ categoryId, input }, "Updating category");
      const result = categoryUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedCategory = CategoriesController.mapCategory(
        await this.categoriesService.update(categoryId, result.data),
      );
      logger.info({ updatedCategory }, "Category updated successfully");
      return updatedCategory;
    } catch (error) {
      this.mapError(error, {
        message: `Error updating category`,
        notFoundMessage: `Error updating category: Category ID "${categoryId}" not found.`,
        duplicateMessage: `Error updating category: Category slug "${input.slug}" already exists.`,
      });
    }
  }

  public async delete(categoryId: string) {
    logger.info({ categoryId }, "Deleting category");

    try {
      await this.categoriesService.delete(categoryId);
      logger.info({ categoryId }, "Category deleted successfully");

      return { success: true };
    } catch (error) {
      this.mapError(error, {
        notFoundMessage: `Error deleting category: Category with the ID "${categoryId}" was not found.`,
        constraintMessage: `Error deleting category: Cannot delete a Category with subcategories.`,
      });
    }
  }

  public async getById(id: string) {
    logger.info({ id }, "Fetching category by id");

    try {
      const category = CategoriesController.mapCategory(
        await this.categoriesService.getById(id),
      );

      if (!category) {
        throw new NotFoundError(`Category ID "${id}" not found.`);
      }

      logger.info({ category }, "Category fetched by ID successfully");
      return category;
    } catch (error) {
      this.mapError(error, {
        message: `Error fetching category by ID "${id}"`,
      });
    }
  }

  public async getBySlug(slug: string) {
    logger.info({ slug }, "Fetching category by slug");

    try {
      const category = CategoriesController.mapCategory(
        await this.categoriesService.getBySlug(slug),
      );

      if (!category) {
        throw new NotFoundError(`Category slug "${slug}"  not found.`);
      }

      logger.info({ category }, "Category fetched by slug successfully");
      return category;
    } catch (error) {
      this.mapError(error, {
        message: `Error fetching category by slug "${slug}"`,
      });
    }
  }

  public async getAll(input: {
    page?: number;
    query?: string;
    pageSize?: number;
  }) {
    logger.info({ input }, "Fetching all categories");

    try {
      const { categories, totalCount } =
        await this.categoriesService.getAll(input);
      const transformedCategories = categories
        .map(CategoriesController.mapCategory)
        .filter((category): category is CategoryDTO => Boolean(category));

      logger.info(
        { categories: transformedCategories, totalCount },
        "Categories fetched successfully",
      );
      return { categories: transformedCategories, totalCount };
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all categories",
      });
    }
  }

  public async getRootCategories() {
    logger.info("Fetching all root categories");

    try {
      const categories = (await this.categoriesService.getRootCategories()).map(
        CategoriesController.mapCategory,
      );
      logger.info({ categories }, "Root categories fetched successfully");
      return categories;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all root categories",
      });
    }
  }

  public async getCategoriesPath(categoryId: string) {
    return this.categoriesService.getCategoriesPath(categoryId);
  }

  private static mapCategory(
    category: Category | null | undefined,
  ): CategoryDTO | null | undefined {
    if (!category) return category;

    return {
      ...category,
      products: category.products.map((product) => ({
        ...product,
        updatedAt: product.updatedAt.toLocaleDateString(),
        createdAt: product.createdAt.toLocaleDateString(),
      })),
      children: category.children.map((child) => ({
        ...child,
        updatedAt: child.updatedAt.toLocaleDateString(),
        createdAt: child.createdAt.toLocaleDateString(),
      })),
      updatedAt: category.updatedAt.toLocaleDateString(),
      createdAt: category.createdAt.toLocaleDateString(),
    };
  }
}
