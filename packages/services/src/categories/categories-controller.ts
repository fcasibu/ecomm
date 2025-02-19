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
import { DuplicateError } from "../errors/duplicate-error";
import type { Category as CategoryType } from "@ecomm/db";

export type Category = CategoryType;

export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  public async create(input: CategoryCreateInput) {
    logger.info({ input }, "Creating a new category");
    const result = categoryCreateSchema.safeParse(input);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    try {
      const category = await this.categoriesService.create(result.data);
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
    logger.info({ categoryId, input }, "Updating category");
    const result = categoryUpdateSchema.safeParse(input);

    if (!result.success) {
      throw new ValidationError(result.error);
    }

    try {
      const updatedCategory = await this.categoriesService.update(
        categoryId,
        result.data,
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

      return null;
    } catch (error) {
      this.mapError(error, {
        notFoundMessage: `Error deleting category: Category with the ID "${categoryId}" was not found.`,
      });
    }
  }

  public async getBySlug(slug: string) {
    logger.info({ slug }, "Fetching category by slug");

    try {
      const category = await this.categoriesService.getBySlug(slug);

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
      const categories = await this.categoriesService.getAll(input);
      logger.info({ categories }, "Categories fetched successfully");
      return categories;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all categories",
      });
    }
  }

  private mapError(
    error: unknown,
    options?: {
      message?: string;
      notFoundMessage?: string;
      duplicateMessage?: string;
    },
  ): never {
    switch ((error as { code?: string })?.code) {
      case "P2025": {
        logger.error({ error }, options?.notFoundMessage);
        throw new NotFoundError(options?.notFoundMessage ?? "");
      }
      case "P2002": {
        logger.error({ error }, options?.duplicateMessage);
        throw new DuplicateError(options?.duplicateMessage ?? "");
      }
    }

    logger.error({ error }, options?.message);
    throw error;
  }
}
