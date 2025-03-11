"use server";

import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { customersController } from "@ecomm/services/registry";
import type {
  CustomerCreateInput,
  CustomerUpdateInput,
} from "@ecomm/validations/customers/customers-schema";
import { revalidateTag } from "next/cache";

export const createCustomer = async (input: CustomerCreateInput) => {
  const result = await executeOperation(() =>
    customersController.create(input),
  );

  if (result.success) {
    revalidateTag("customers");
  }

  return result;
};

export const updateCustomerById = async (
  id: string,
  input: CustomerUpdateInput,
) => {
  const result = await executeOperation(() =>
    customersController.update(id, input),
  );

  if (result.success) {
    revalidateTag("customers");
    revalidateTag(`customer_${id}`);
  }

  return result;
};

export const deleteCustomerById = async (id: string) => {
  const result = await executeOperation(() => customersController.delete(id));

  if (result.success) {
    revalidateTag("customers");
  }

  return result;
};
