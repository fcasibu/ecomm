import { PrismaClient } from "@ecomm/db";
import type { Prisma } from "@ecomm/db";
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from "@ecomm/validations/cms/customers/customers-schema";
import type { SearchOptions } from "../base-service";
import { BaseService } from "../base-service";
import { hashPassword } from "../utils/password";
import { createTextSearchCondition } from "../utils/prisma-helpers";

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

  public async create(input: CustomerCreateInput) {
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
      },
    });
  }

  public async getById(customerId: string) {
    return await this.prismaClient.customer.findUnique({
      where: { id: customerId },
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
    });
  }

  public async getAll(options: SearchOptions) {
    const { query, page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    let whereCondition = {};

    if (query) {
      whereCondition = createTextSearchCondition(query, [
        "email",
        "firstName",
        "lastName",
        "phone",
      ]);
    }

    const [customers, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.customer.findMany({
        include: CUSTOMER_INCLUDE,
        omit: CUSTOMER_OMIT,
        where: whereCondition,
        orderBy: { updatedAt: "desc" },
        ...pagination,
      }),
      this.prismaClient.customer.count({ where: whereCondition }),
    ]);

    return this.formatPaginatedResponse(customers, totalCount, options);
  }

  public async update(customerId: string, input: CustomerUpdateInput) {
    return await this.executeTransaction(async (tx) => {
      const existingAddressIds = input.addresses
        .map((address) => address.id)
        .filter((id): id is string => Boolean(id));

      const addressesToUpdate = input.addresses.filter((address) => address.id);
      const addressesToCreate = input.addresses.filter(
        (address) => !address.id,
      );

      return await tx.customer.update({
        where: { id: customerId },
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

  public async delete(customerId: string) {
    return await this.prismaClient.customer.delete({
      where: { id: customerId },
      include: CUSTOMER_INCLUDE,
      omit: CUSTOMER_OMIT,
    });
  }
}
