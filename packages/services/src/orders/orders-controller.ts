import type { Order, OrdersService } from "./orders-service";
import { ValidationError } from "../errors/validation-error";
import { BaseController } from "../base-controller";
import { logger } from "@ecomm/lib/logger";
import { NotFoundError } from "../errors/not-found-error";
import type { OrderDTO } from "./order-dto";
import {
  orderCreateSchema,
  orderUpdateSchema,
  type OrderCreateInput,
  type OrderUpdateInput,
} from "@ecomm/validations/orders/orders-schema";

export class OrdersController extends BaseController {
  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  public async create(input: OrderCreateInput) {
    try {
      logger.info({ input }, "Creating a new order");
      const result = orderCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const order = OrdersController.mapOrder(
        await this.ordersService.create(result.data),
      );

      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      logger.info({ order }, "Order successfully created");

      return order;
    } catch (error) {
      this.mapError(error, {
        message: "Error creating order",
      });
    }
  }

  public async update(orderId: string, input: OrderUpdateInput) {
    try {
      logger.info({ orderId, input }, "Updating order");
      const result = orderUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedOrder = OrdersController.mapOrder(
        await this.ordersService.update(orderId, result.data),
      );
      logger.info({ updatedOrder }, "Order updated successfully");
      return updatedOrder;
    } catch (error) {
      this.mapError(error, {
        message: `Error updating order`,
        notFoundMessage: `Error updating order: Order ID "${orderId}" not found.`,
      });
    }
  }

  public async getById(id: string) {
    try {
      logger.info({ id }, "Fetching order");

      const order = OrdersController.mapOrder(
        await this.ordersService.getById(id),
      );

      if (!order) {
        throw new NotFoundError(`Order ID "${id}" not found.`);
      }

      logger.info({ order }, "Fetched order");

      return order;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching order",
      });
    }
  }

  public async getAll(input: { page?: number; pageSize?: number }) {
    logger.info({ input }, "Fetching all orders");

    try {
      const result = await this.ordersService.getAll(input);

      const transformedOrders = result.items
        .map(OrdersController.mapOrder)
        .filter((order): order is OrderDTO => Boolean(order));

      const response = {
        orders: transformedOrders,
        totalCount: result.totalCount,
        pageCount: result.pageCount,
        currentPage: result.currentPage,
        pageSize: result.pageSize,
      };

      logger.info({ response }, "Orders fetched successfully");

      return response;
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all orders",
      });
    }
  }

  private static mapOrder(
    order: Order | null | undefined,
  ): OrderDTO | null | undefined {
    if (!order) return order;

    return {
      ...order,
      totalAmount: order.totalAmount.toNumber(),
      customer: {
        email: order.customer?.email as string,
        addresses:
          order.customer?.addresses.map((address) => ({
            ...address,
            updatedAt: address.updatedAt.toLocaleDateString(),
            createdAt: address.createdAt.toLocaleDateString(),
          })) ?? [],
      },
      items: order.items.map((item) => ({
        ...item,
        price: item.price.toNumber(),
        updatedAt: item.updatedAt.toLocaleDateString(),
        createdAt: item.createdAt.toLocaleDateString(),
      })),
      updatedAt: order.updatedAt.toLocaleDateString(),
      createdAt: order.createdAt.toLocaleDateString(),
    };
  }
}
