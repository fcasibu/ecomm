import { PrismaClient } from "@ecomm/db";
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from "@ecomm/validations/customers/customers-schema";
import { hashPassword } from "../utils/password";

export class CustomersService {
  constructor(private readonly prismaClient: PrismaClient) {}

  public async create(input: CustomerCreateInput) {
    return await this.prismaClient.customer.create({
      include: {
        addresses: true,
      },
      omit: {
        password: true,
      },
      data: {
        firstName: input.firstName,
        middleName: input.middleName,
        lastName: input.lastName,
        birthDate: input.birthDate,
        password: input.password
          ? await hashPassword(input.password)
          : undefined,
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
      where: {
        id: customerId,
      },
      include: {
        addresses: true,
      },
      omit: {
        password: true,
      },
    });
  }

  public async getAll({
    page,
    query,
    pageSize,
  }: {
    query?: string;
    page?: number;
    pageSize?: number;
  }) {
    const [customers, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.customer.findMany({
        include: {
          addresses: true,
        },
        omit: {
          password: true,
        },
        ...(page && pageSize
          ? { skip: (page - 1) * pageSize, take: pageSize }
          : {}),
        ...(query
          ? {
              where: {
                OR: [{ email: { contains: query, mode: "insensitive" } }],
              },
            }
          : {}),
        orderBy: {
          updatedAt: "desc",
        },
      }),
      this.prismaClient.customer.count({
        ...(query
          ? {
              where: {
                OR: [{ email: { contains: query, mode: "insensitive" } }],
              },
            }
          : {}),
      }),
    ]);

    return { customers, totalCount };
  }

  public async update(customerId: string, input: CustomerUpdateInput) {
    return await this.prismaClient.customer.update({
      where: { id: customerId },
      include: {
        addresses: true,
      },
      omit: {
        password: true,
      },
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
            id: {
              notIn: input.addresses
                .map((address) => address.id)
                .filter((id): id is string => Boolean(id)),
            },
          },
          updateMany: input.addresses
            .filter((address) => address.id)
            .map((address) => ({
              where: { id: address.id as string },
              data: address,
            })),

          createMany: {
            data: input.addresses.filter((address) => !address.id),
          },
        },
      },
    });
  }

  public async delete(customerId: string) {
    return await this.prismaClient.customer.delete({
      where: { id: customerId },
    });
  }
}
