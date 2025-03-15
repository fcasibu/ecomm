import type { CustomersService } from './customers-service';
import { ValidationError } from '../errors/validation-error';
import { BaseController } from '../base-controller';
import { logger } from '@ecomm/lib/logger';
import { NotFoundError } from '../errors/not-found-error';
import {
  customerCreateSchema,
  customerUpdateSchema,
  type CustomerCreateInput,
  type CustomerUpdateInput,
} from '@ecomm/validations/cms/customers/customers-schema';
import type { CustomerDTO } from './customer-dto';
import { CustomerTransformer } from './customer-transformer';

export class CustomersController extends BaseController {
  private readonly transformer = new CustomerTransformer();

  constructor(private readonly customersService: CustomersService) {
    super();
  }

  public async create(locale: string, input: CustomerCreateInput) {
    try {
      logger.info({ input }, 'Creating a new customer');
      const result = customerCreateSchema.safeParse(input);

      if (!result.success) throw new ValidationError(result.error);

      const customer = this.transformer.toDTO(
        await this.customersService.create(locale, result.data),
      );

      if (!customer) {
        throw new NotFoundError('Customer not found.');
      }

      logger.info({ customerId: customer.id }, 'Customer successfully created');

      return customer;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error creating customer',
      });
    }
  }

  public async update(
    locale: string,
    customerId: string,
    input: CustomerUpdateInput,
  ) {
    try {
      logger.info({ customerId, input }, 'Updating customer');
      const result = customerUpdateSchema.safeParse(input);

      if (!result.success) {
        throw new ValidationError(result.error);
      }

      const updatedCustomer = this.transformer.toDTO(
        await this.customersService.update(locale, customerId, result.data),
      );
      if (!updatedCustomer) {
        throw new NotFoundError(`Customer ID "${customerId}" not found.`);
      }

      logger.info(
        { customerId: updatedCustomer.id },
        'Customer updated successfully',
      );
      return updatedCustomer;
    } catch (error) {
      this.logAndThrowError(error, {
        message: `Error updating customer`,
        notFoundMessage: `Error updating customer: Customer ID "${customerId}" not found.`,
      });
    }
  }

  public async delete(locale: string, customerId: string) {
    logger.info({ customerId }, 'Deleting customer');

    try {
      await this.customersService.delete(locale, customerId);
      logger.info({ customerId }, 'Customer deleted successfully');

      return { success: true };
    } catch (error) {
      this.logAndThrowError(error, {
        notFoundMessage: `Error deleting customer: Customer with the ID "${customerId}" was not found.`,
      });
    }
  }

  public async getById(locale: string, id: string) {
    try {
      logger.info({ id }, 'Fetching customer');

      const customer = this.transformer.toDTO(
        await this.customersService.getById(locale, id),
      );

      if (!customer) {
        throw new NotFoundError(`Customer ID "${id}" not found.`);
      }

      logger.info({ customerId: customer.id }, 'Fetched customer');

      return customer;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching customer',
      });
    }
  }

  public async getAll(
    locale: string,
    input: {
      page?: number;
      query?: string;
      pageSize?: number;
    },
  ) {
    logger.info({ input }, 'Fetching all customers');

    try {
      const result = await this.customersService.getAll(locale, input);

      const transformedCustomers = result.items
        .map((item) => this.transformer.toDTO(item))
        .filter((customer): customer is CustomerDTO => Boolean(customer));

      const response = {
        customers: transformedCustomers,
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
        'Customers fetched successfully',
      );

      return response;
    } catch (error) {
      this.logAndThrowError(error, {
        message: 'Error fetching all customers',
      });
    }
  }
}
