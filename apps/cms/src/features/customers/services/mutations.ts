"use server";

import "server-only";

import { executeOperation } from "@ecomm/lib/execute-operation";
import { customersController } from "@ecomm/services/registry";
import type { CustomerCreateInput } from "@ecomm/validations/customers/customers-schema";
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
