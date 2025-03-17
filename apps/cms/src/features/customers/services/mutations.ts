'use server';

import { executeOperation } from '@ecomm/lib/execute-operation';
import { customersController } from '@ecomm/services/registry';
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from '@ecomm/validations/cms/customers/customers-schema';
import { revalidateTag } from 'next/cache';

export const createCustomer = async (
  locale: string,
  input: CustomerCreateInput,
) => {
  const result = await executeOperation(() =>
    customersController().create(locale, input),
  );

  if (result.success) {
    revalidateTag('customers');
  }

  return result;
};

export const updateCustomerById = async (
  locale: string,
  id: string,
  input: CustomerUpdateInput,
) => {
  const result = await executeOperation(() =>
    customersController().update(locale, id, input),
  );

  if (result.success) {
    revalidateTag('customers');
    revalidateTag(`customer_${id}`);
  }

  return result;
};

export const deleteCustomerById = async (locale: string, id: string) => {
  const result = await executeOperation(() =>
    customersController().delete(locale, id),
  );

  if (result.success) {
    revalidateTag('customers');
  }

  return result;
};
