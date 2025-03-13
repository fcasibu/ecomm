import { PrismaClient } from "@ecomm/db";
import type { Prisma } from "@ecomm/db";
import type {
  OrderCreateInput,
  OrderUpdateInput,
} from "@ecomm/validations/orders/orders-schema";
import type { SearchOptions } from "../base-service";
import { BaseService } from "../base-service";

export type Order = Prisma.OrderGetPayload<{
  include: {
    items: true;
    customer: {
      select: {
        email: true;
        addresses: true;
      };
    };
  };
}>;

const ORDER_INCLUDE = {
  items: true,
  customer: {
    select: {
      email: true,
      addresses: true,
    },
  },
} as const satisfies Prisma.OrderInclude;

export class OrdersService extends BaseService {
  constructor(prismaClient: PrismaClient) {
    super(prismaClient);
  }

  public async create(input: OrderCreateInput) {
    return await this.prismaClient.order.create({
      include: ORDER_INCLUDE,
      data: {
        customerId: input.customerId,
        totalAmount: input.cart.totalAmount,
        currency: input.currency,
        billingAddressId: input.billingAddressId,
        shippingAddressId: input.shippingAddressId,
        items: {
          createMany: {
            data: input.cart.items.map((item) => ({
              sku: item.sku,
              image: item.image,
              name: item.name,
              quantity: item.quantity,
              currencyCode: item.currencyCode,
              price: item.price,
            })),
          },
        },
      },
    });
  }

  public async getById(orderId: string) {
    return await this.prismaClient.order.findUnique({
      where: { id: orderId },
      include: ORDER_INCLUDE,
    });
  }

  public async getAll(options: SearchOptions) {
    const { page = 1, pageSize = 20 } = options;
    const pagination = this.buildPagination({ page, pageSize });

    const [customers, totalCount] = await this.prismaClient.$transaction([
      this.prismaClient.order.findMany({
        include: ORDER_INCLUDE,
        orderBy: { updatedAt: "desc" },
        ...pagination,
      }),
      this.prismaClient.order.count(),
    ]);

    return this.formatPaginatedResponse(customers, totalCount, options);
  }

  public async update(orderId: string, input: OrderUpdateInput) {
    return await this.prismaClient.order.update({
      where: { id: orderId },
      include: ORDER_INCLUDE,
      data: {
        status: input.orderStatus,
      },
    });
  }
}
