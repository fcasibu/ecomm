import { PrismaClient } from '@ecomm/db';
import { BaseService, type SearchOptions } from '../base-service';
import type { StoreCreateInput } from '@ecomm/validations/cms/store/store-schema';
import { createTextSearchCondition } from '../utils/prisma-helpers';

export class StoreService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(input: StoreCreateInput) {
    return await this.prismaClient.store.create({
      data: {
        locale: input.locale,
        currency: input.currency,
      },
    });
  }

  public async getByLocale(locale: string) {
    return await this.prismaClient.store.findUnique({
      where: { locale },
    });
  }

  public async getById(storeId: string) {
    return await this.prismaClient.store.findUnique({
      where: { id: storeId },
    });
  }

  public async getAll(options: SearchOptions) {
    const { query, page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    let whereCondition = {};

    if (query) {
      whereCondition = createTextSearchCondition(query, ['locale']);
    }

    const [stores, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.store.findMany({
        where: whereCondition,
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
      this.prismaClient.store.count({ where: whereCondition }),
    ]);

    return this.formatPaginatedResponse(stores, totalCount, options);
  }

  public async delete(storeId: string) {
    return await this.prismaClient.store.delete({
      where: { id: storeId },
    });
  }
}
