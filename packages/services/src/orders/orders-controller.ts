import type { OrdersService } from "./orders-service";
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
} from "@ecomm/validations/cms/orders/orders-schema";
import { OrderTransformer } from "./order-transformer";

export class OrdersController extends BaseController {
  private readonly transformer = new OrderTransformer();

  constructor(private readonly ordersService: OrdersService) {
    super();
  }

  public async create(locale: string, input: OrderCreateInput) {
    try {
      logger.info({ input }, "Creating a new order");
      const result = orderCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const order = this.transformer.toDTO(
        await this.ordersService.create(locale, result.data),
      );

      if (!order) {
        throw new NotFoundError("Order not found.");
      }

      logger.info({ orderId: order.id }, "Order successfully created");

      return order;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error creating order",
      });
    }
  }

  public async update(
    locale: string,
    orderId: string,
    input: OrderUpdateInput,
  ) {
    try {
      logger.info({ orderId, input }, "Updating order");
      const result = orderUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedOrder = this.transformer.toDTO(
        await this.ordersService.update(locale, orderId, result.data),
      );

      if (!updatedOrder) {
        throw new NotFoundError(`Order ID "${orderId}" not found.`);
      }

      logger.info({ orderId: updatedOrder.id }, "Fetched order");
      return updatedOrder;
    } catch (error) {
      this.logAndThrowError(error, {
        message: `Error updating order`,
        notFoundMessage: `Error updating order: Order ID "${orderId}" not found.`,
      });
    }
  }

  public async getById(locale: string, id: string) {
    try {
      logger.info({ id }, "Fetching order");

      const order = this.transformer.toDTO(
        await this.ordersService.getById(locale, id),
      );

      if (!order) {
        throw new NotFoundError(`Order ID "${id}" not found.`);
      }

      logger.info({ orderId: order.id }, "Fetched order");

      return order;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error fetching order",
      });
    }
  }

  public async getAll(
    locale: string,
    input: { page?: number; pageSize?: number },
  ) {
    logger.info({ input }, "Fetching all orders");

    try {
      const result = await this.ordersService.getAll(locale, input);

      const transformedOrders = result.items
        .map((item) => this.transformer.toDTO(item))
        .filter((order): order is OrderDTO => Boolean(order));

      const response = {
        orders: transformedOrders,
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
        "Orders fetched successfully",
      );

      return response;
    } catch (error) {
      this.logAndThrowError(error, {
        message: "Error fetching all orders",
      });
    }
  }
}
