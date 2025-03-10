"use server";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { customersController } from "@ecomm/services/registry";
import type { CustomerCreateInput } from "@ecomm/validations/customers/customers-schema";
import "server-only";

// TODO(fcasibu): revalidation
export const createCustomer = async (input: CustomerCreateInput) => {
  const result = await executeOperation(() =>
    customersController.create(input),
  );

  return result;
};
