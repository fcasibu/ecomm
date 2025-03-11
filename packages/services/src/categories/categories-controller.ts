import type { CategoriesService, Category } from "./categories-service";
import { ValidationError } from "../errors/validation-error";
import {
  type CategoryCreateInput,
  categoryCreateSchema,
  type CategoryUpdateInput,
  categoryUpdateSchema,
} from "@ecomm/validations/categories/category-schema";
import { NotFoundError } from "../errors/not-found-error";
import { logger } from "@ecomm/lib/logger";
import type { CategoryDTO } from "./category-dto";
import { BaseController } from "../base-controller";
import type { ProductVariant } from "../products/product-dto";

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
      const result = await this.categoriesService.getAll(input);

      const transformedCategories = result.items
        .map(CategoriesController.mapCategory)
        .filter((category): category is CategoryDTO => Boolean(category));

      const response = {
        categories: transformedCategories,
        totalCount: result.totalCount,
        pageCount: result.pageCount,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      };

      logger.info({ response }, "Categories fetched successfully");

      return response;
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
    return await this.categoriesService.getCategoriesPath(categoryId);
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
        variants: product.variants.map((variant) => ({
          ...variant,
          price: variant.price.toNumber(),
          updatedAt: variant.updatedAt.toLocaleDateString(),
          createdAt: variant.createdAt.toLocaleDateString(),
          attributes:
            variant.attributes?.valueOf() as ProductVariant["attributes"],
        })),
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
