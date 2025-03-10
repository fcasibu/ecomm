import type { CustomersService } from "./customers-service";
import { ValidationError } from "../errors/validation-error";
import { BaseController } from "../base-controller";
import type { Prisma } from "@ecomm/db";
import { logger } from "@ecomm/lib/logger";
import { NotFoundError } from "../errors/not-found-error";
import {
  customerCreateSchema,
  type CustomerCreateInput,
} from "@ecomm/validations/customers/customers-schema";
import type { CustomerDTO } from "./customer-dto";

type Customer = Prisma.CustomerGetPayload<{
  include: {
    addresses: true;
  };
  omit: {
    password: true;
  };
}>;

export class CustomersController extends BaseController {
  constructor(private readonly customersService: CustomersService) {
    super();
  }

  public async create(input: CustomerCreateInput) {
    try {
      logger.info({ input }, "Creating a new customer");
      const result = customerCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const customer = CustomersController.mapCustomer(
        await this.customersService.create(result.data),
      );

      if (!customer) {
        throw new NotFoundError("Customer not found.");
      }

      logger.info({ customer }, "Customer successfully created");

      return customer;
    } catch (error) {
      this.mapError(error, {
        message: "Error creating customer",
      });
    }
  }

  public async update() {}

  public async delete() {}

  public async getById() {}

  public async getAll(input: {
    page?: number;
    query?: string;
    pageSize?: number;
  }) {
    logger.info({ input }, "Fetching all customers");

    try {
      const { customers, totalCount } =
        await this.customersService.getAll(input);
      const transformedCustomers = customers
        .map(CustomersController.mapCustomer)
        .filter((customer): customer is CustomerDTO => Boolean(customer));

      logger.info(
        { categories: transformedCustomers, totalCount },
        "Customers fetched successfully",
      );
      return { customers: transformedCustomers, totalCount };
    } catch (error) {
      this.mapError(error, {
        message: "Error fetching all customers",
      });
    }
  }

  private static mapCustomer(
    customer: Customer | null | undefined,
  ): CustomerDTO | null | undefined {
    if (!customer) return customer;

    return {
      ...customer,
      birthDate: customer.birthDate?.toLocaleDateString() ?? "",
      updatedAt: customer.updatedAt.toLocaleDateString(),
      createdAt: customer.createdAt.toLocaleDateString(),
      addresses: customer.addresses.map((address) => ({
        ...address,
        updatedAt: address.updatedAt.toLocaleDateString(),
        createdAt: address.createdAt.toLocaleDateString(),
      })),
    };
  }
}
