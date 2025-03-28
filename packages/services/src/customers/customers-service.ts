import { PrismaClient } from '@ecomm/db';
import type { Prisma } from '@ecomm/db';
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from '@ecomm/validations/cms/customers/customers-schema';
import type { SearchOptions } from '../base-service';
import { BaseService } from '../base-service';
import { hashPassword } from '../utils/password';
import { createTextSearchCondition } from '../utils/prisma-helpers';
import type { ServerContext } from '@ecomm/lib/types';
import type { PostLoginInput } from '@ecomm/validations/web/customer/post-login-schema';

export type Customer = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
  };
  omit: {
    password: true;
  };
}>;

const CUSTOMER_INCLUDE = {
  addresses: true,
} as const satisfies Prisma.CustomerInclude;

const CUSTOMER_OMIT = {
  password: true,
} as const satisfies Prisma.CustomerOmit;

export class CustomersService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(locale: string, input: CustomerCreateInput) {
    const hashedPassword = input.password
      ? await hashPassword(input.password)
      : undefined;

    return await this.prismaClient.customer.create({
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
      data: {
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        birthDate: input.birthDate,
        password: hashedPassword,
        email: input.email,
        phone: input.phone,
        addresses: {
          createMany: {
            data: input.addresses,
          },
        },
        store: { connect: { locale } },
      },
    });
  }

  public async getById(locale: string, customerId: string) {
    return await this.prismaClient.customer.findUnique({
      where: { id: customerId, locale },
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
    });
  }

  public async getAll(locale: string, options: SearchOptions) {
    const { query, page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    let whereCondition: Prisma.CustomerWhereInput = { locale };

    if (query) {
      whereCondition = createTextSearchCondition(query, [
        'email',
        'firstName',
        'lastName',
        'phone',
      ]);
    }

    const [customers, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.customer.findMany({
        include: CUSTOMER_INCLUDE,
        omit: CUSTOMER_OMIT,
        where: whereCondition,
        orderBy: { updatedAt: 'desc' },
        ...pagination,
      }),
      this.prismaClient.customer.count({ where: whereCondition }),
    ]);

    return this.formatPaginatedResponse(customers, totalCount, options);
  }

  public async update(
    locale: string,
    customerId: string,
    input: CustomerUpdateInput,
  ) {
    return await this.executeTransaction(async (tx) => {
      const existingAddressIds = input.addresses
        .map((address) => address.id)
        .filter((id): id is string => Boolean(id));

      const addressesToUpdate = input.addresses.filter((address) => address.id);
      const addressesToCreate = input.addresses.filter(
        (address) => !address.id,
      );

      return await tx.customer.update({
        where: { id: customerId, locale },
        include: CUSTOMER_INCLUDE,
        omit: CUSTOMER_OMIT,
        data: {
          firstName: input.firstName,
          middleName: input.middleName,
          lastName: input.lastName,
          birthDate: input.birthDate,
          email: input.email,
          phone: input.phone,
          addresses: {
            deleteMany: {
              customerId,
              id: { notIn: existingAddressIds },
            },
            updateMany: addressesToUpdate.map((address) => ({
              where: { id: address.id as string },
              data: address,
            })),
            createMany: {
              data: addressesToCreate,
            },
          },
        },
      });
    });
  }

  public async delete(locale: string, customerId: string) {
    return await this.prismaClient.customer.delete({
      where: { id: customerId, locale },
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
    });
  }

  public async postLogin(context: ServerContext, input: PostLoginInput) {
    const { locale, user } = context;

    return await this.prismaClient.customer.update({
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
      where: { anonymousId: user.anonymousId ?? undefined, locale },
      data: {
        id: {
          set: input.authUserId,
        },
        anonymousId: {
          set: null,
        },
        email: input.emailAddress,
      },
    });
  }
}
