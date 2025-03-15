import type { StoreService } from './store-service';
import { ValidationError } from '../errors/validation-error';
import { BaseController } from '../base-controller';
import { logger } from '@ecomm/lib/logger';
import {
  storeCreateSchema,
  type StoreCreateInput,
} from '@ecomm/validations/cms/store/store-schema';
import { StoreTransformer } from './store-transformer';
import type { StoreDTO } from './store-dto';

export class StoreController extends BaseController {
  private readonly transformer = new StoreTransformer();

  constructor(private readonly storeService: StoreService) {
    super();
  }

  public async create(input: StoreCreateInput) {
    try {
      logger.info({ input }, 'Creating a new store');

      const result = storeCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const store = this.transformer.toDTO(
        await this.storeService.create(result.data),
      );
      if (!store) {
        throw new Error('Store not found');
      }

      logger.info({ storeId: store.id }, 'Store successfully created');
      return store;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error creating store',
      });
    }
  }

  public async getByLocale(locale: string) {
    try {
      logger.info({ locale }, 'Fetching store');

      const store = this.transformer.toDTO(
        await this.storeService.getByLocale(locale),
      );

      if (!store) {
        throw new Error('Store not found');
      }

      logger.info({ storeId: store.id }, 'Fetched store');
      return store;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching store',
      });
    }
  }

  public async getAll(input: {
    page?: number;
    query?: string;
    pageSize?: number;
  }) {
    logger.info({ input }, 'Fetching all stores');

    try {
      const result = await this.storeService.getAll(input);

      const transformedStores = result.items
        .map((item) => this.transformer.toDTO(item))
        .filter((store): store is StoreDTO => Boolean(store));

      const response = {
        stores: transformedStores,
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
        'Store fetched successfully',
      );

      return response;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching all stores',
      });
    }
  }

  public async delete(storeId: string) {
    logger.info({ storeId }, 'Deleting store');

    try {
      const result = await this.storeService.delete(storeId);
      logger.info({ storeId }, 'Store deleted successfully');

      return { success: true, locale: result.locale };
    } catch (error) {
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting store: Store with the ID "${storeId}" was not found.`,
      });
    }
  }
}
