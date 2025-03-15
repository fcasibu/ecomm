import type { CategoriesService } from "./categories-service";
import { ValidationError } from "../errors/validation-error";
import {
  type CategoryCreateInput,
  categoryCreateSchema,
  type CategoryUpdateInput,
  categoryUpdateSchema,
} from "@ecomm/validations/cms/categories/category-schema";
import { NotFoundError } from "../errors/not-found-error";
import { logger } from "@ecomm/lib/logger";
import type { CategoryDTO } from "./category-dto";
import { BaseController } from "../base-controller";
import { CategoryTransformer } from "./category-transformer";

export class CategoriesController extends BaseController {
  private readonly transformer = new CategoryTransformer();

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

      const category = this.transformer.toDTO(
        await this.categoriesService.create(result.data),
      );

      if (!category) {
        throw new NotFoundError("Category not found.");
      }

      logger.info({ categoryId: category.id }, "Category created successfully");
      return category;
    } catch (error) {
      this.logAndThrowError(error, {
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

      const updatedCategory = this.transformer.toDTO(
        await this.categoriesService.update(categoryId, result.data),
      );
      if (!updatedCategory) {
        throw new NotFoundError(`Category ID "${categoryId}" not found.`);
      }

      logger.info(
        { categoryId: updatedCategory.id },
        "Category updated successfully",
      );
      return updatedCategory;
    } catch (error) {
      this.logAndThrowError(error, {
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
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting category: Category with the ID "${categoryId}" was not found.`,
        constraintMessage: `Error deleting category: Cannot delete a Category with subcategories.`,
      });
    }
  }

  public async getById(id: string) {
    logger.info({ id }, "Fetching category by id");

    try {
      const category = this.transformer.toDTO(
        await this.categoriesService.getById(id),
      );

      if (!category) {
        throw new NotFoundError(`Category ID "${id}" not found.`);
      }

      logger.info(
        { categoryId: category.id },
        "Category fetched by ID successfully",
      );
      return category;
    } catch (error) {
      this.logAndThrowError(error, {
        message: `Error fetching category by ID "${id}"`,
      });
    }
  }

  public async getBySlug(slug: string) {
    logger.info({ slug }, "Fetching category by slug");

    try {
      const category = this.transformer.toDTO(
        await this.categoriesService.getBySlug(slug),
      );

      if (!category) {
        throw new NotFoundError(`Category slug "${slug}"  not found.`);
      }

      logger.info(
        { categoryId: category.id },
        "Category fetched by slug successfully",
      );
      return category;
    } catch (error) {
      this.logAndThrowError(error, {
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
      const result = await this.categoriesService.getAll(input);

      const transformedCategories = result.items
        .map((item) => this.transformer.toDTO(item))
        .filter((category): category is CategoryDTO => Boolean(category));

      const response = {
        categories: transformedCategories,
        totalCount: result.totalCount,
        pageCount: result.pageCount,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      };

      logger.info(
        {
          totalCount: response.totalCount,
          pageCount: response.pageCount,
          currentPage: response.currentPage,
          pageSize: response.pageSize,
        },
        "Categories fetched successfully",
      );

      return response;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error fetching all categories",
      });
    }
  }

  public async getRootCategories() {
    logger.info("Fetching all root categories");

    try {
      const categories = (await this.categoriesService.getRootCategories()).map(
        this.transformer.toDTO,
      );
      logger.info({ categories }, "Root categories fetched successfully");
      return categories;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error fetching all root categories",
      });
    }
  }

  public async getCategoriesPath(categoryId: string) {
    return await this.categoriesService.getCategoriesPath(categoryId);
  }
}
