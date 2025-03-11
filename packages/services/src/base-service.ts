import { PrismaClient } from "@ecomm/db";

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

export interface SearchOptions extends PaginationOptions {
  query?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageCount: number;
  currentPage: number;
  pageSize: number;
}

export abstract class BaseService {
  constructor(protected readonly prismaClient: PrismaClient) {}

  protected buildPagination(options: PaginationOptions): {
    skip?: number;
    take?: number;
  } {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;

    return {
      skip: (page - 1) * pageSize,
      take: pageSize,
    };
  }

  protected formatPaginatedResponse<T>(
    items: T[],
    totalCount: number,
    options: PaginationOptions,
  ): PaginatedResult<T> {
    const page = options.page ?? 1;
    const pageSize = options.pageSize ?? 20;
    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      items,
      totalCount,
      pageCount,
      currentPage: page,
      pageSize,
    };
  }

  protected async executeTransaction<T>(
    operations: () => Promise<T>,
  ): Promise<T> {
    return await this.prismaClient.$transaction(async () => {
      return await operations();
    });
  }
}
